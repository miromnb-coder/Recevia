import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { chatTools } from "@/lib/ai/tools";

type AnyMessage = {
  role: string;
  content: string | null;
  tool_calls?: unknown;
  tool_call_id?: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const widgetKey = String(body?.widget_key ?? "").trim();
  const sessionId = String(body?.session_id ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!widgetKey || !sessionId || !message) {
    return NextResponse.json({ error: "widget_key, session_id ja message tarvitaan." }, { status: 400 });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY puuttuu." }, { status: 500 });
  }

  const admin = createServiceClient();
  const { data: org } = await admin
    .from("organizations")
    .select("id, name")
    .eq("widget_key", widgetKey)
    .maybeSingle();

  if (!org) {
    return NextResponse.json({ error: "Tuntematon widget." }, { status: 401 });
  }

  let conversation = (
    await admin
      .from("conversations")
      .select("id, status")
      .eq("organization_id", org.id)
      .eq("session_id", sessionId)
      .maybeSingle()
  ).data;

  if (!conversation) {
    const created = await admin
      .from("conversations")
      .insert({
        organization_id: org.id,
        channel: "web",
        session_id: sessionId,
        status: "open",
      })
      .select("id, status")
      .single();
    if (created.error || !created.data) {
      return NextResponse.json({ error: created.error?.message ?? "Keskustelua ei voitu luoda." }, { status: 500 });
    }
    conversation = created.data;
  }

  await admin.from("messages").insert({
    conversation_id: conversation.id,
    role: "user",
    content: message,
  });

  const [{ data: agent }, { data: services }, { data: history }] = await Promise.all([
    admin.from("agent_configs").select("model, system_prompt_snapshot").eq("organization_id", org.id).maybeSingle(),
    admin.from("services").select("name, duration_min, price_from, description").eq("organization_id", org.id).eq("active", true),
    admin
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true })
      .limit(20),
  ]);

  const system =
    agent?.system_prompt_snapshot ||
    `Olet Recevian vastaanottaja yritykselle ${org.name}. Alae keksi hintoja. Yksi kysymys per viesti.`;

  const messages: AnyMessage[] = [
    { role: "system", content: system },
    ...(history ?? []).map((row) => ({ role: row.role, content: row.content })),
  ];

  let reply = "En saanut vastausta juuri nyt.";
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
      return NextResponse.json({ error: `OpenAI: ${err.slice(0, 240)}` }, { status: 500 });
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
      if (call.function.name === "get_services") {
        result = JSON.stringify(services ?? []);
      } else if (call.function.name === "create_lead") {
        const name = String(args.name ?? "").trim();
        const phone = String(args.phone ?? "").trim();
        if (!name || !phone) {
          result = "Tarvitaan nimi ja puhelin.";
        } else {
          await admin.from("leads").insert({
            organization_id: org.id,
            conversation_id: conversation.id,
            name,
            phone,
            email: args.email ? String(args.email) : null,
            interest: args.interest ? String(args.interest) : null,
            status: "new",
            summary: message,
          });
          await admin
            .from("conversations")
            .update({ status: "lead", visitor_name: name, visitor_phone: phone })
            .eq("id", conversation.id);
          result = "Liidi tallennettu.";
        }
      } else if (call.function.name === "escalate") {
        await admin.from("conversations").update({ status: "handoff" }).eq("id", conversation.id);
        result = "Keskustelu merkitty handoffiksi.";
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

  return NextResponse.json({
    reply,
    conversation_id: conversation.id,
    suggested_slots: [],
  });
}

function safeJson(raw: string) {
  try {
    return JSON.parse(raw || "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}
