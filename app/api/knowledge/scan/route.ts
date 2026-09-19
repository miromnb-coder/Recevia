import { NextResponse } from "next/server";
import { buildPromptSnapshot } from "@/lib/ai/prompt";
import { extractBusinessFromText } from "@/lib/ai/extract-business";
import { getCurrentOrgId } from "@/lib/org";
import { fetchSiteText, normalizeWebsite } from "@/lib/web/fetch-site";

export async function POST(request: Request) {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) {
    return NextResponse.json({ error: "Ei yritystä." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const websiteRaw = String(body?.website ?? "").trim();
  if (!websiteRaw) {
    return NextResponse.json({ error: "Verkkosivu puuttuu." }, { status: 400 });
  }

  let site;
  try {
    normalizeWebsite(websiteRaw);
    site = await fetchSiteText(websiteRaw);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sivua ei voitu lukea." },
      { status: 400 },
    );
  }

  const { data: org } = await supabase.from("organizations").select("name").eq("id", organizationId).maybeSingle();

  let extracted;
  try {
    extracted = await extractBusinessFromText({
      company: org?.name || "Yritys",
      website: site.url,
      text: site.text,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tietoja ei voitu poimia." },
      { status: 500 },
    );
  }

  const profilePatch = {
    greeting: extracted.greeting,
    phone: extracted.phone,
    address: extracted.address,
    rules: extracted.rules,
    language: "fi",
    hours: extracted.hours,
  };

  const profile = await supabase.from("business_profiles").upsert({
    organization_id: organizationId,
    ...profilePatch,
  });
  if (profile.error) {
    return NextResponse.json({ error: profile.error.message }, { status: 500 });
  }

  await supabase.from("organizations").update({
    allowed_domains: [site.hostname, "localhost"],
  }).eq("id", organizationId);

  await supabase.from("services").delete().eq("organization_id", organizationId);
  if (extracted.services.length) {
    const insert = await supabase.from("services").insert(
      extracted.services.map((s) => ({
        organization_id: organizationId,
        name: s.name,
        duration_min: s.duration_min,
        price_from: s.price_from,
        description: s.description,
        active: true,
      })),
    );
    if (insert.error) {
      return NextResponse.json({ error: insert.error.message }, { status: 500 });
    }
  }

  await supabase.from("knowledge_items").delete().eq("organization_id", organizationId);
  if (extracted.faqs.length) {
    const insert = await supabase.from("knowledge_items").insert(
      extracted.faqs.map((f) => ({
        organization_id: organizationId,
        kind: "faq",
        question: f.question,
        answer: f.answer,
        source_url: site.url,
      })),
    );
    if (insert.error) {
      return NextResponse.json({ error: insert.error.message }, { status: 500 });
    }
  }

  const snapshot = buildPromptSnapshot({
    company: org?.name || "Yritys",
    profile: profilePatch,
    services: extracted.services,
    faqs: extracted.faqs,
  });

  await supabase
    .from("agent_configs")
    .upsert({ organization_id: organizationId, system_prompt_snapshot: snapshot });

  return NextResponse.json({
    ok: true,
    website: site.url,
    services: extracted.services.length,
    faqs: extracted.faqs.length,
  });
}
