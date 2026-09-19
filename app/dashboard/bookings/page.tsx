import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";

export default async function BookingsPage() {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");

  const { data: rows } = await supabase
    .from("bookings")
    .select("id, starts_at, ends_at, customer_name, customer_phone, status")
    .eq("organization_id", organizationId)
    .order("starts_at", { ascending: false });

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Varaukset</h1>
      <div className="mt-6 divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/10 bg-white">
        {(rows ?? []).length === 0 ? (
          <p className="p-5 text-sm text-navy/60">Ei varauksia viela.</p>
        ) : (
          (rows ?? []).map((row) => (
            <div key={row.id} className="px-5 py-4 text-sm text-navy/80">
              <p className="font-medium text-navy">{row.customer_name || "Asiakas"}</p>
              <p className="mt-1">
                {new Date(row.starts_at).toLocaleString("fi-FI")} · {row.status}
                {row.customer_phone ? ` · ${row.customer_phone}` : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
