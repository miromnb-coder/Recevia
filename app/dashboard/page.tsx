import Link from "next/link";
import type { ReactNode } from "react";
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
  let org: { name: string; slug: string } | null = null;
  let conversations = 0;
  let leads = 0;
  let bookings = 0;
  let recentConversations: { id: string; visitor_name: string | null; channel: string | null; updated_at: string }[] = [];
  let upcomingBookings: { id: string; customer_name: string | null; starts_at: string; status: string | null }[] = [];

  if (organizationId) {
    const [{ data }, conv, lead, book, recent, upcoming] = await Promise.all([
      supabase.from("organizations").select("name, slug").eq("id", organizationId).maybeSingle(),
      supabase.from("conversations").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
      supabase
        .from("conversations")
        .select("id, visitor_name, channel, updated_at")
        .eq("organization_id", organizationId)
        .order("updated_at", { ascending: false })
        .limit(5),
      supabase
        .from("bookings")
        .select("id, customer_name, starts_at, status")
        .eq("organization_id", organizationId)
        .order("starts_at", { ascending: true })
        .limit(5),
    ]);
    org = data;
    conversations = conv.count ?? 0;
    leads = lead.count ?? 0;
    bookings = book.count ?? 0;
    recentConversations = recent.data ?? [];
    upcomingBookings = upcoming.data ?? [];
  }

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Yhteenveto</h1>
          <p className="mt-2 max-w-xl text-sm text-mute">
            {org ? `${org.name} · keskustelut, liidit ja varaukset.` : "Profiilia ei löytynyt. Luo tili uudestaan."}
          </p>
        </div>
        {org ? (
          <Link href={`/w/${org.slug}`} className="rounded-full bg-ink px-4 py-2 text-sm text-white">
            Avaa esikatselu
          </Link>
        ) : null}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Metric href="/dashboard/conversations" label="Keskustelut" value={conversations} />
        <Metric href="/dashboard/leads" label="Liidit" value={leads} />
        <Metric href="/dashboard/bookings" label="Varaukset" value={bookings} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <Panel title="Viimeisimmät keskustelut" href="/dashboard/conversations">
          {recentConversations.length === 0 ? (
            <Empty text="Ei vielä keskusteluja." action={org ? `/w/${org.slug}` : undefined} actionLabel="Testaa chatissa" />
          ) : (
            <ul className="divide-y divide-line">
              {recentConversations.map((row) => (
                <li key={row.id}>
                  <Link href={`/dashboard/conversations/${row.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-mist">
                    <span className="text-sm font-medium">{row.visitor_name || "Tuntematon"}</span>
                    <span className="text-xs text-mute">{row.channel || "chat"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Seuraavat varaukset" href="/dashboard/bookings">
          {upcomingBookings.length === 0 ? (
            <Empty text="Ei vielä varauksia." />
          ) : (
            <ul className="divide-y divide-line">
              {upcomingBookings.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <span className="text-sm font-medium">{row.customer_name || "Asiakas"}</span>
                  <span className="text-xs text-mute">{new Date(row.starts_at).toLocaleString("fi-FI")}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </main>
  );
}

function Metric({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value: number;
}) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-mute">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Link>
  );
}

function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
        <Link href={href} className="text-xs text-mute hover:text-ink">
          Näytä kaikki
        </Link>
      </div>
      {children}
    </section>
  );
}

function Empty({
  text,
  action,
  actionLabel,
}: {
  text: string;
  action?: string;
  actionLabel?: string;
}) {
  return (
    <div className="px-5 py-8 text-sm text-mute">
      <p>{text}</p>
      {action && actionLabel ? (
        <Link href={action} className="mt-2 inline-block text-ink underline">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
