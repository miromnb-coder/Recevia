import { NextResponse } from "next/server";
import { buildPromptSnapshot } from "@/lib/ai/prompt";
import { getCurrentOrgId } from "@/lib/org";

type IncomingService = {
  name: string;
  duration_min: number;
  price_from: number | null;
  description: string;
};
type IncomingFaq = { question: string; answer: string };

export async function POST(request: Request) {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) {
    return NextResponse.json({ error: "Ei yritysta." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Tyhja pyynto." }, { status: 400 });

  const profilePatch = {
    greeting: String(body.greeting ?? "").trim() || "Miten voin auttaa tanaan?",
    phone: String(body.phone ?? "").trim() || null,
    address: String(body.address ?? "").trim() || null,
    rules: String(body.rules ?? "").trim() || null,
    hours: body.hours ?? {},
  };

  const profile = await supabase
    .from("business_profiles")
    .update(profilePatch)
    .eq("organization_id", organizationId);

  if (profile.error) {
    return NextResponse.json({ error: profile.error.message }, { status: 500 });
  }

  const services = Array.isArray(body.services) ? (body.services as IncomingService[]) : [];
  const faqs = Array.isArray(body.faqs) ? (body.faqs as IncomingFaq[]) : [];

  await supabase.from("services").delete().eq("organization_id", organizationId);
  if (services.length) {
    const insert = await supabase.from("services").insert(
      services
        .filter((s) => s.name.trim())
        .map((s) => ({
          organization_id: organizationId,
          name: s.name.trim(),
          duration_min: Number(s.duration_min) || 30,
          price_from: s.price_from,
          description: s.description || null,
          active: true,
        })),
    );
    if (insert.error) {
      return NextResponse.json({ error: insert.error.message }, { status: 500 });
    }
  }

  await supabase.from("knowledge_items").delete().eq("organization_id", organizationId);
  if (faqs.length) {
    const insert = await supabase.from("knowledge_items").insert(
      faqs
        .filter((f) => f.question.trim() && f.answer.trim())
        .map((f) => ({
          organization_id: organizationId,
          kind: "faq",
          question: f.question.trim(),
          answer: f.answer.trim(),
        })),
    );
    if (insert.error) {
      return NextResponse.json({ error: insert.error.message }, { status: 500 });
    }
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId)
    .single();

  const snapshot = buildPromptSnapshot({
    company: org?.name || "Yritys",
    profile: profilePatch,
    services: services.map((s) => ({
      name: s.name,
      duration_min: Number(s.duration_min) || 30,
      price_from: s.price_from,
      description: s.description,
    })),
    faqs,
  });

  await supabase
    .from("agent_configs")
    .update({ system_prompt_snapshot: snapshot })
    .eq("organization_id", organizationId);

  return NextResponse.json({ ok: true, snapshot });
}
