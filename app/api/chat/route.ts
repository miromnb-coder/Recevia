import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { runAgent } from "@/lib/ai/run-agent";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const widgetKey = String(body?.widget_key ?? "").trim();
  const sessionId = String(body?.session_id ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!widgetKey || !sessionId || !message) {
    return NextResponse.json({ error: "widget_key, session_id ja message tarvitaan." }, { status: 400 });
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

  const { data: owner } = await admin
    .from("profiles")
    .select("email")
    .eq("organization_id", org.id)
    .eq("role", "owner")
    .maybeSingle();

  const result = await runAgent({
    organizationId: org.id,
    orgName: org.name,
    ownerEmail: owner?.email,
    sessionId,
    message,
    channel: "web",
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 500 });
  }

  return NextResponse.json(result);
}
