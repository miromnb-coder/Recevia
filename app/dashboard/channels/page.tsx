import { redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";
import { appUrl } from "@/lib/calendar/google";

export default async function ChannelsPage() {
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");

  const { data: org } = await supabase
    .from("organizations")
    .select("name, slug, widget_key")
    .eq("id", organizationId)
    .maybeSingle();

  if (!org) redirect("/signup");

  const origin = appUrl();
  const snippet = `<script src="${origin}/widget.js" data-key="${org.widget_key}"></script>`;
  const webhook = `${origin}/api/whatsapp/webhook`;
  const twilioReady = Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER,
  );
  const mapped = process.env.WHATSAPP_ORG_SLUG === org.slug;

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Kanavat</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">Sama vastaanottaja chatissa ja WhatsAppissa.</p>

      <div className="mt-8 grid gap-3">
        <section className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm font-medium">Website</p>
          <pre className="mt-3 overflow-auto rounded-xl bg-mist p-3 text-xs">{snippet}</pre>
          <p className="mt-4 text-sm text-mute">
            Esikatselu:{" "}
            <a className="underline" href={`/w/${org.slug}`}>
              {`/w/${org.slug}`}
            </a>
          </p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm font-medium">WhatsApp</p>
          <p className="mt-2 text-sm text-mute">
            {twilioReady ? "Twilio-avaimet ovat Vercelissä." : "Lisää Verceliin TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN ja TWILIO_WHATSAPP_NUMBER."}
          </p>
          <p className="mt-2 text-sm text-mute">
            {mapped
              ? `Tämä yritys (${org.slug}) vastaanottaa sandbox-viestit.`
              : `Aseta WHATSAPP_ORG_SLUG=${org.slug} jos tämä yritys on WhatsApp-demo.`}
          </p>
          <p className="mt-3 break-all text-xs text-mute">Webhook: {webhook}</p>
          <p className="mt-3 text-sm text-mute">
            Twilio sandbox: liitä webhook When a message comes in -kohtaan, avaa WhatsApp ja lähetä sandboxin liittymiskoodi.
          </p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm font-medium">SMS</p>
          <p className="mt-2 text-sm text-mute">Tulossa myöhemmin.</p>
        </section>
      </div>
    </main>
  );
}
