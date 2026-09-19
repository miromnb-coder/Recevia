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
    <main className="px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Asetukset</h1>
      <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-5 text-sm text-navy/80">
        <p>Ilmoitukset menevat tilin sahkopostiin: {profile?.email || "ei osoitetta"}</p>
        <p className="mt-3">
          Resend: {ready ? "avain on asetettu" : "RESEND_API_KEY puuttuu Vercelista. Chat toimii silti."}
        </p>
      </div>
    </main>
  );
}
