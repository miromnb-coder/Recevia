import { NextResponse } from "next/server";
import { slugify, widgetKey } from "@/lib/slug";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const company = String(body?.company ?? "").trim();
  if (company.length < 2) {
    return NextResponse.json({ error: "Yrityksen nimi puuttuu." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error:
          "Sessio puuttuu. Laita Authentication > Providers > Email > Confirm email pois paalta demossa, tai vahvista sahkoposti.",
      },
      { status: 401 },
    );
  }

  const admin = createServiceClient();

  const existing = await admin
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing.data?.organization_id) {
    return NextResponse.json({ ok: true, existing: true });
  }

  let slug = slugify(company);
  for (let i = 0; i < 8; i += 1) {
    const taken = await admin.from("organizations").select("id").eq("slug", slug).maybeSingle();
    if (!taken.data) break;
    slug = `${slugify(company)}-${i + 2}`;
  }

  const orgInsert = await admin
    .from("organizations")
    .insert({
      name: company,
      slug,
      widget_key: widgetKey(),
      allowed_domains: ["localhost"],
      status: "draft",
    })
    .select("id")
    .single();

  if (orgInsert.error || !orgInsert.data) {
    return NextResponse.json({ error: orgInsert.error?.message ?? "Org failed" }, { status: 500 });
  }

  const organizationId = orgInsert.data.id;

  const profile = await admin.from("profiles").upsert({
    id: user.id,
    organization_id: organizationId,
    email: user.email,
    full_name: company,
    role: "owner",
  });

  if (profile.error) {
    return NextResponse.json({ error: profile.error.message }, { status: 500 });
  }

  await admin.from("business_profiles").upsert({
    organization_id: organizationId,
    greeting: "Miten voin auttaa tanaan?",
    language: "fi",
  });

  await admin.from("agent_configs").upsert({
    organization_id: organizationId,
    model: "gpt-4o-mini",
    system_prompt_snapshot: `Olet Recevian vastaanottaja yritykselle ${company}. Vastaa asiakkaan kielella. Yksi kysymys per viesti. Alae keksia hintoja.`,
  });

  return NextResponse.json({ ok: true, slug });
}
