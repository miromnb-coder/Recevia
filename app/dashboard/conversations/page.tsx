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
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Keskustelut</h1>
      <p className="mt-2 text-sm text-mute">Kaikki chat-ketjut tälle yritykselle.</p>
      <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {(rows ?? []).length === 0 ? (
          <p className="px-5 py-8 text-sm text-mute">Ei vielä keskusteluja.</p>
        ) : (
          (rows ?? []).map((row) => (
            <Link key={row.id} href={`/dashboard/conversations/${row.id}`} className="block px-5 py-4 hover:bg-mist">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{row.visitor_name || "Tuntematon"}</p>
                <span className="text-xs text-mute">{row.status}</span>
              </div>
              <p className="mt-1 text-sm text-mute">
                {row.channel} {row.visitor_phone ? `· ${row.visitor_phone}` : ""}
              </p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
