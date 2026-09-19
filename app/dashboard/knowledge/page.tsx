import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";
import { KnowledgeForm } from "./form";

const emptyHours = {
  timezone: "Europe/Helsinki",
  days: {
    mon: { open: "08:00", close: "17:00" },
    tue: { open: "08:00", close: "17:00" },
    wed: { open: "08:00", close: "17:00" },
    thu: { open: "08:00", close: "17:00" },
    fri: { open: "08:00", close: "16:00" },
    sat: null,
    sun: null,
  },
};

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; website?: string }>;
}) {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");
  const query = await searchParams;

  const [{ data: profile }, { data: services }, { data: faqs }, { data: agent }] =
    await Promise.all([
      supabase.from("business_profiles").select("*").eq("organization_id", organizationId).maybeSingle(),
      supabase.from("services").select("name, duration_min, price_from, description").eq("organization_id", organizationId),
      supabase.from("knowledge_items").select("question, answer").eq("organization_id", organizationId),
      supabase.from("agent_configs").select("system_prompt_snapshot").eq("organization_id", organizationId).maybeSingle(),
    ]);

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Tietämys</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">
        Agentti käyttää vain näitä hintoja ja vastauksia. Tallenna ennen kuin testaat chattia.
      </p>
      {query.mode === "scan" ? (
        <p className="mt-4 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-mute">
          Automaattinen sivun luku tulee pian.
          {query.website ? ` Tallenna tiedot sivulta ${query.website}.` : " Täytä tiedot sivulta käsin toistaiseksi."}
        </p>
      ) : null}
      <KnowledgeForm
        greeting={profile?.greeting ?? "Miten voin auttaa tänään?"}
        phone={profile?.phone ?? ""}
        address={profile?.address ?? ""}
        rules={profile?.rules ?? ""}
        hours={profile?.hours ?? emptyHours}
        services={services ?? []}
        faqs={faqs ?? []}
        snapshot={agent?.system_prompt_snapshot ?? ""}
      />
    </main>
  );
}
