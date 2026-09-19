import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";
import { createServiceClient } from "@/lib/supabase/server";
import { googleRedirectUri } from "@/lib/calendar/google";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");
  const query = await searchParams;

  const admin = createServiceClient();
  const { data: connection } = await admin
    .from("calendar_connections")
    .select("calendar_id, timezone, updated_at")
    .eq("organization_id", organizationId)
    .maybeSingle();

  const configured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const redirectUri = googleRedirectUri();

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Kalenteri</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">
        Kytke yrityksen Google-kalenteri. Chat ehdottaa vain vapaita aikoja.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        {connection ? (
          <p className="text-sm">Kytketty: {connection.calendar_id} · {connection.timezone}</p>
        ) : (
          <p className="text-sm text-mute">Kalenteria ei ole vielä kytketty.</p>
        )}
        {configured ? (
          <a href="/api/calendar/connect" className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm text-white">
            {connection ? "Kytke uudelleen" : "Kytke Google Calendar"}
          </a>
        ) : (
          <p className="mt-4 text-sm text-mute">Lisää Verceliin GOOGLE_CLIENT_ID ja GOOGLE_CLIENT_SECRET.</p>
        )}
        <p className="mt-4 break-all text-xs text-mute">Google redirect URI: {redirectUri}</p>
        {query.ok ? <p className="mt-3 text-sm">Kalenteri kytketty.</p> : null}
        {query.error ? <p className="mt-3 text-sm text-mute">Virhe: {query.error}</p> : null}
      </div>
    </main>
  );
}
