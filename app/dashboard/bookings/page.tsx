import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";

const statusLabel: Record<string, string> = {
  confirmed: "vahvistettu",
  cancelled: "peruttu",
};

export default async function BookingsPage() {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");

  const { data: rows } = await supabase
    .from("bookings")
    .select("id, starts_at, ends_at, customer_name, customer_phone, status")
    .eq("organization_id", organizationId)
    .order("starts_at", { ascending: false });

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Varaukset</h1>
      <p className="mt-2 text-sm text-mute">Ajat, jotka Recevia on kirjannut kalenteriin.</p>
      <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {(rows ?? []).length === 0 ? (
          <p className="px-5 py-8 text-sm text-mute">Ei vielä varauksia.</p>
        ) : (
          (rows ?? []).map((row) => (
            <div key={row.id} className="px-5 py-4 text-sm">
              <p className="font-medium">{row.customer_name || "Asiakas"}</p>
              <p className="mt-1 text-mute">
                {new Date(row.starts_at).toLocaleString("fi-FI", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}{" "}
                · {statusLabel[row.status] ?? row.status}
                {row.customer_phone ? ` · ${row.customer_phone}` : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
