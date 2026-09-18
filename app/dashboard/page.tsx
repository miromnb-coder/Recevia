import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  let org = null;
  if (profile?.organization_id) {
    const { data } = await supabase
      .from("organizations")
      .select("name, slug, status, widget_key")
      .eq("id", profile.organization_id)
      .maybeSingle();
    org = data;
  }

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Yhteenveto</h1>
      <p className="mt-2 max-w-xl text-sm text-navy/60">
        Agentti, keskustelut ja kalenteri kytketaan seuraavissa vaiheissa. Nyt varmistetaan vain, etta yritys on eristetty.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Keskustelut tanaan", "Uudet liidit", "Varaukset"].map((label) => (
          <div key={label} className="rounded-2xl border border-navy/10 bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-navy/50">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-navy">0</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-5">
        <p className="text-sm font-medium text-navy">Tama yritys</p>
        {org ? (
          <dl className="mt-3 grid gap-2 text-sm text-navy/70">
            <div>Nimi: {org.name}</div>
            <div>Slug: {org.slug}</div>
            <div>Tila: {org.status}</div>
            <div>Widget-avain: {org.widget_key}</div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-teal">Profiilia ei loytynyt. Luo tili uudestaan /signup-sivulta.</p>
        )}
      </div>
    </main>
  );
}
