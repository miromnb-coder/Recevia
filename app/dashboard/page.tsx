import Link from "next/link";
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

  const organizationId = profile?.organization_id ?? null;
  let org = null;
  let conversations = 0;
  let leads = 0;
  let bookings = 0;

  if (organizationId) {
    const [{ data }, conv, lead, book] = await Promise.all([
      supabase.from("organizations").select("name, slug, status, widget_key").eq("id", organizationId).maybeSingle(),
      supabase.from("conversations").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
    ]);
    org = data;
    conversations = conv.count ?? 0;
    leads = lead.count ?? 0;
    bookings = book.count ?? 0;
  }

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Yhteenveto</h1>
      <p className="mt-2 max-w-xl text-sm text-navy/60">
        Tietamys on tallennettu. Testaa vastaanottajaa esikatselussa ja katso ketju Keskustelut-sivulta.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Keskustelut", conversations],
          ["Liidit", leads],
          ["Varaukset", bookings],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-navy/10 bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-navy/50">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-navy">{value}</p>
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
            <div>
              <Link className="text-teal underline" href={`/w/${org.slug}`}>
                Avaa esikatseluchat
              </Link>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-teal">Profiilia ei loytynyt. Luo tili uudestaan /signup-sivulta.</p>
        )}
      </div>
    </main>
  );
}
