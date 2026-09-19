import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";

export default async function ConversationsPage() {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");

  const { data: rows } = await supabase
    .from("conversations")
    .select("id, channel, status, visitor_name, visitor_phone, updated_at")
    .eq("organization_id", organizationId)
    .order("updated_at", { ascending: false });

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Keskustelut</h1>
      <p className="mt-2 text-sm text-navy/60">Kaikki Chat-ketjut talle yritykselle.</p>
      <div className="mt-6 divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/10 bg-white">
        {(rows ?? []).length === 0 ? (
          <p className="p-5 text-sm text-navy/60">Ei keskusteluja viela. Avaa esikatseluchat ja laheta viesti.</p>
        ) : (
          (rows ?? []).map((row) => (
            <Link key={row.id} href={`/dashboard/conversations/${row.id}`} className="block px-5 py-4 hover:bg-sand">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-navy">{row.visitor_name || "Tuntematon"}</p>
                <span className="text-xs uppercase tracking-widest text-teal">{row.status}</span>
              </div>
              <p className="mt-1 text-sm text-navy/50">
                {row.channel} {row.visitor_phone ? `· ${row.visitor_phone}` : ""}
              </p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
