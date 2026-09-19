import { createServiceClient } from "@/lib/supabase/server";
import { chatTools } from "@/lib/ai/tools";
import { accessTokenFromRefresh, createGoogleEvent, listFreeSlots } from "@/lib/calendar/google";
import { notifyOwner } from "@/lib/notify";

type AnyMessage = {
  role: string;
  content: string | null;
  tool_calls?: unknown;
  tool_call_id?: string;
};

function finlandNow() {
  return new Intl.DateTimeFormat("fi-FI", {
    timeZone: "Europe/Helsinki",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function formatSlot(iso: string) {
  return new Intl.DateTimeFormat("fi-FI", {
    timeZone: "Europe/Helsinki",
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function safeJson(raw: string) {
  try {
    return JSON.parse(raw || "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function runAgent(input: {
  organizationId: string;
  orgName: string;
  ownerEmail?: string | null;
  sessionId: string;
  message: string;
  channel: "web" | "whatsapp" | "sms";
  visitorPhone?: string | null;
}) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return { error: "OPENAI_API_KEY puuttuu.", status: 500 as const };

  const admin = createServiceClient();

  let conversation = (
    await admin
      .from("conversations")
      .select("id, status")
      .eq("organization_id", input.organizationId)
      .eq("session_id", input.sessionId)
      .maybeSingle()
  ).data;

  if (!conversation) {
    const created = await admin
      .from("conversations")
      .insert({
        organization_id: input.organizationId,
        channel: input.channel,
        session_id: input.sessionId,
        status: "open",
        visitor_phone: input.visitorPhone || null,
      })
      .select("id, status")
      .single();
    if (created.error || !created.data) {
      return { error: created.error?.message ?? "Keskustelua ei voitu luoda.", status: 500 as const };
    }
    conversation = created.data;
  } else if (input.visitorPhone) {
    await admin.from("conversations").update({ visitor_phone: input.visitorPhone }).eq("id", conversation.id);
  }

  await admin.from("messages").insert({
    conversation_id: conversation.id,
    role: "user",
    content: input.message,
  });

  const [{ data: agent }, { data: services }, { data: history }, { data: calendar }] = await Promise.all([
    admin.from("agent_configs").select("model, system_prompt_snapshot").eq("organization_id", input.organizationId).maybeSingle(),
    admin.from("services").select("name, duration_min, price_from, description").eq("organization_id", input.organizationId).eq("active", true),
    admin
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true })
      .limit(20),
    admin
      .from("calendar_connections")
      .select("google_refresh_token")
      .eq("organization_id", input.organizationId)
      .maybeSingle(),
  ]);

  const system =
    (agent?.system_prompt_snapshot || `Olet Recevian vastaanottaja yritykselle ${input.orgName}.`) +
    `\n\nTämä päivä (Europe/Helsinki): ${finlandNow()}. Käytä tätä vuotta.` +
    (input.channel === "whatsapp" ? "\nKanava on WhatsApp. Vastaa lyhyesti, ilman markdownia." : "") +
    (input.visitorPhone ? `\nAsiakkaan numero: ${input.visitorPhone}. Voit käyttää sitä liidissä ja varauksessa.` : "") +
    "\nÄlä keksi vapaita aikoja. Kutsu check_availability ennen ajan ehdottamista. Jos kalenteri ei ole kytketty, pyydä yhteystiedot.";

  const messages: AnyMessage[] = [
    { role: "system", content: system },
    ...(history ?? []).map((row) => ({ role: row.role, content: row.content })),
  ];

  let reply = "En saanut vastausta juuri nyt.";
  let suggestedSlots: string[] = [];

  for (let step = 0; step < 4; step += 1) {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: agent?.model || "gpt-4o-mini",
        temperature: 0.3,
        messages,
        tools: chatTools,
      }),
    });

    if (!completion.ok) {
      const err = await completion.text();
      return { error: `OpenAI: ${err.slice(0, 240)}`, status: 500 as const };
    }

    const data = await completion.json();
    const choice = data.choices?.[0]?.message;
    if (!choice) break;

    const toolCalls = choice.tool_calls as Array<{
      id: string;
      function: { name: string; arguments: string };
    }> | undefined;

    if (!toolCalls?.length) {
      reply = String(choice.content ?? "").trim() || reply;
      break;
    }

    messages.push({
      role: "assistant",
      content: choice.content ?? null,
      tool_calls: toolCalls,
    });

    for (const call of toolCalls) {
      const args = safeJson(call.function.arguments);
      let result = "ok";
      try {
        if (call.function.name === "get_services") {
          result = JSON.stringify(services ?? []);
        } else if (call.function.name === "check_availability") {
          if (!calendar?.google_refresh_token) {
            result = "Kalenteri ei ole kytketty. Älä ehdota keksittyjä aikoja. Pyydä nimi ja puhelin.";
          } else {
            const token = await accessTokenFromRefresh(calendar.google_refresh_token);
            suggestedSlots = await listFreeSlots(token, Number(args.duration_min) || 30);
            result = JSON.stringify({
              slots: suggestedSlots.map((iso) => ({ iso, label: formatSlot(iso) })),
            });
          }
        } else if (call.function.name === "create_booking") {
          const name = String(args.customer_name ?? "").trim();
          const phone = String(args.customer_phone ?? input.visitorPhone ?? "").trim();
          const startsAt = String(args.starts_at ?? "");
          const duration = Number(args.duration_min) || 30;
          const start = new Date(startsAt);
          const past = Number.isNaN(start.getTime()) || start.getTime() < Date.now() - 60_000;
          const allowed =
            suggestedSlots.length === 0 ||
            suggestedSlots.some((iso) => Math.abs(new Date(iso).getTime() - start.getTime()) < 15 * 60 * 1000);
          if (!name || !phone || !startsAt) {
            result = "Tarvitaan starts_at, nimi ja puhelin.";
          } else if (past) {
            result = "Aika on menneisyydessä. Käytä check_availability-ISO-aikaa.";
          } else if (!allowed) {
            result = "Aika ei ole tarjotuissa sloteissa.";
          } else if (!calendar?.google_refresh_token) {
            result = "Kalenteri ei ole kytketty.";
          } else {
            const token = await accessTokenFromRefresh(calendar.google_refresh_token);
            const end = new Date(start.getTime() + duration * 60 * 1000);
            const eventId = await createGoogleEvent({
              accessToken: token,
              title: `${args.service_name || "Aika"} · ${name}`,
              startIso: start.toISOString(),
              endIso: end.toISOString(),
              attendee: args.customer_email ? String(args.customer_email) : undefined,
            });
            await admin.from("bookings").insert({
              organization_id: input.organizationId,
              conversation_id: conversation.id,
              starts_at: start.toISOString(),
              ends_at: end.toISOString(),
              customer_name: name,
              customer_phone: phone,
              gcal_event_id: eventId,
              status: "confirmed",
            });
            await admin
              .from("conversations")
              .update({ status: "booked", visitor_name: name, visitor_phone: phone })
              .eq("id", conversation.id);
            await notifyOwner({
              to: input.ownerEmail,
              subject: `Uusi varaus · ${input.orgName}`,
              text: `${name} / ${phone}\n${start.toLocaleString("fi-FI")}\n${args.service_name || "Aika"}`,
            });
            result = JSON.stringify({ booked: true, starts_at: start.toISOString(), label: formatSlot(start.toISOString()) });
          }
        } else if (call.function.name === "create_lead") {
          const name = String(args.name ?? "").trim();
          const phone = String(args.phone ?? input.visitorPhone ?? "").trim();
          if (!name || !phone) {
            result = "Tarvitaan nimi ja puhelin.";
          } else {
            await admin.from("leads").insert({
              organization_id: input.organizationId,
              conversation_id: conversation.id,
              name,
              phone,
              email: args.email ? String(args.email) : null,
              interest: args.interest ? String(args.interest) : null,
              status: "new",
              summary: input.message,
            });
            await admin
              .from("conversations")
              .update({ status: "lead", visitor_name: name, visitor_phone: phone })
              .eq("id", conversation.id);
            await notifyOwner({
              to: input.ownerEmail,
              subject: `Uusi liidi · ${input.orgName}`,
              text: `${name} / ${phone}\n${args.interest || input.message}`,
            });
            result = "Liidi tallennettu.";
          }
        } else if (call.function.name === "escalate") {
          await admin.from("conversations").update({ status: "handoff" }).eq("id", conversation.id);
          result = "Keskustelu merkitty handoffiksi.";
        }
      } catch (error) {
        result = error instanceof Error ? error.message : "Tyokalovirhe";
      }
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: result,
      });
    }
  }

  await admin.from("messages").insert({
    conversation_id: conversation.id,
    role: "assistant",
    content: reply,
  });

  return {
    reply: reply.slice(0, 1500),
    conversation_id: conversation.id,
    suggested_slots: suggestedSlots,
  };
}
