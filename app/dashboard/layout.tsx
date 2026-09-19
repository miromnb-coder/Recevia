import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const nav = [
  ["Yhteenveto", "/dashboard"],
  ["Tietamys", "/dashboard/knowledge"],
  ["Keskustelut", "/dashboard/conversations"],
  ["Liidit", "/dashboard/leads"],
  ["Varaukset", "/dashboard/bookings"],
  ["Kalenteri", "/dashboard/calendar"],
  ["Kanavat", "/dashboard/channels"],
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
    <div className="min-h-screen bg-sand md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-navy/10 bg-white px-5 py-6 md:border-b-0 md:border-r">
        <Link href="/" className="text-sm font-semibold text-navy">Recevia</Link>
        <p className="mt-2 text-lg font-semibold text-navy">{orgName}</p>
        <nav className="mt-8 grid gap-1 text-sm">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-lg px-2 py-2 text-navy/70 hover:bg-mist hover:text-navy">
              {label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/signout" method="post" className="mt-10">
          <button className="text-sm text-navy/50 hover:text-navy" type="submit">Kirjaudu ulos</button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
