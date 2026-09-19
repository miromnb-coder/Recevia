import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { runAgent } from "@/lib/ai/run-agent";

function digits(value: string) {
  return value.replace(/^whatsapp:/i, "").replace(/\s+/g, "");
}

async function sendWhatsApp(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!sid || !token || !from) throw new Error("Twilio-avaimet puuttuvat.");
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
      To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
      Body: body,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err.slice(0, 200));
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let from = "";
  let body = "";
  let messageSid = "";

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    from = String(form.get("From") ?? "");
    body = String(form.get("Body") ?? "").trim();
    messageSid = String(form.get("MessageSid") ?? form.get("SmsMessageSid") ?? "");
  } else {
    const json = await request.json().catch(() => null);
    const message = json?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    from = message?.from ? `+${String(message.from).replace(/^\+/, "")}` : "";
    body = String(message?.text?.body ?? "").trim();
    messageSid = String(message?.id ?? "");
  }

  if (!from || !body) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createServiceClient();
  if (messageSid) {
    const seen = await admin.from("inbound_message_ids").insert({ id: messageSid });
    if (seen.error && /duplicate|unique/i.test(seen.error.message)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
  }

  const slug = process.env.WHATSAPP_ORG_SLUG ?? "";
  const { data: org } = slug
    ? await admin.from("organizations").select("id, name").eq("slug", slug).maybeSingle()
    : await admin.from("organizations").select("id, name").limit(1).maybeSingle();

  if (!org) {
    return NextResponse.json({ error: "WhatsApp-yritystä ei löytynyt. Aseta WHATSAPP_ORG_SLUG." }, { status: 500 });
  }

  const { data: owner } = await admin
    .from("profiles")
    .select("email")
    .eq("organization_id", org.id)
    .eq("role", "owner")
    .maybeSingle();

  const phone = digits(from);
  const result = await runAgent({
    organizationId: org.id,
    orgName: org.name,
    ownerEmail: owner?.email,
    sessionId: `wa:${phone}`,
    message: body,
    channel: "whatsapp",
    visitorPhone: phone,
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  try {
    await sendWhatsApp(phone, result.reply ?? "");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "WhatsApp-lähetys epäonnistui." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, conversation_id: result.conversation_id });
}
