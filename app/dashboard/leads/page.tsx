import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";

export default async function LeadsPage() {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");

  const { data: rows } = await supabase
    .from("leads")
    .select("id, name, phone, email, interest, status, conversation_id, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Liidit</h1>
      <p className="mt-2 text-sm text-mute">Nimi ja numero tallentuvat chatista.</p>
      <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {(rows ?? []).length === 0 ? (
          <p className="px-5 py-8 text-sm text-mute">Ei vielä liidejä.</p>
        ) : (
          (rows ?? []).map((row) => (
            <div key={row.id} className="px-5 py-4">
              <p className="font-medium">{row.name || "Nimetön"}</p>
              <p className="mt-1 text-sm text-mute">
                {row.phone || "ei numeroa"} · {row.status}
                {row.interest ? ` · ${row.interest}` : ""}
              </p>
              {row.conversation_id ? (
                <Link href={`/dashboard/conversations/${row.conversation_id}`} className="mt-2 inline-block text-sm underline">
                  Avaa keskustelu
                </Link>
              ) : null}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
