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

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Kanavat</h1>
      <p className="mt-2 max-w-xl text-sm text-navy/60">
        V1: website-chat. Liita tama rivi yrityksen sivun loppuun, ennen &lt;/body&gt;.
      </p>
      <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-5">
        <p className="text-sm font-medium text-navy">Upotuskoodi</p>
        <pre className="mt-3 overflow-auto rounded-xl bg-sand p-3 text-xs text-navy">{snippet}</pre>
        <p className="mt-4 text-sm text-navy/60">
          Esikatselu: <a className="text-teal underline" href={`/w/${org.slug}`}>{`/w/${org.slug}`}</a>
        </p>
        <p className="mt-2 text-sm text-navy/60">
          Widget-avain: {org.widget_key}
        </p>
      </div>
    </main>
  );
}
