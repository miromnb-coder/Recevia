import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";

export default async function SettingsPage() {
  const { supabase, user, organizationId } = await getCurrentOrgId();
  if (!organizationId || !user) redirect("/signup");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .maybeSingle();

  const ready = Boolean(process.env.RESEND_API_KEY);

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Asetukset</h1>
      <p className="mt-2 text-sm text-mute">Tili ja ilmoitukset.</p>
      <div className="mt-8 rounded-2xl border border-line bg-white p-5 text-sm">
        <p>Ilmoitukset menevät tilin sähköpostiin: {profile?.email || "ei osoitetta"}</p>
        <p className="mt-3 text-mute">
          Resend: {ready ? "avain on asetettu" : "RESEND_API_KEY puuttuu Vercelista. Chat toimii silti."}
        </p>
      </div>
    </main>
  );
}
