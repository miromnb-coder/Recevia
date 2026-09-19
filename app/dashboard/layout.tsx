import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Mark } from "@/components/brand";

const nav = [
  ["Yhteenveto", "/dashboard"],
  ["Tietämys", "/dashboard/knowledge"],
  ["Keskustelut", "/dashboard/conversations"],
  ["Liidit", "/dashboard/leads"],
  ["Varaukset", "/dashboard/bookings"],
  ["Kalenteri", "/dashboard/calendar"],
  ["Kanavat", "/dashboard/channels"],
  ["Asetukset", "/dashboard/settings"],
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, email")
    .eq("id", user.id)
    .maybeSingle();

  let orgName = "Recevia";
  if (profile?.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .maybeSingle();
    if (org?.name) orgName = org.name;
  }

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-line bg-white px-5 py-6 md:border-b-0 md:border-r">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <Mark className="h-5 w-5" /> Recevia
        </Link>
        <p className="mt-4 text-lg font-semibold">{orgName}</p>
        <nav className="mt-8 grid gap-1 text-sm">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-lg px-2 py-2 text-mute hover:bg-mist hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/signout" method="post" className="mt-10">
          <button className="text-sm text-mute hover:text-ink" type="submit">Kirjaudu ulos</button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
