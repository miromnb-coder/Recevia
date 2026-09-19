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
    <main className="px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Kanavat</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">
        V1: website-chat. Liitä tämä rivi yrityksen sivun loppuun, ennen &lt;/body&gt;.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-medium">Upotuskoodi</p>
        <pre className="mt-3 overflow-auto rounded-xl bg-mist p-3 text-xs">{snippet}</pre>
        <p className="mt-4 text-sm text-mute">
          Esikatselu:{" "}
          <a className="underline" href={`/w/${org.slug}`}>
            {`/w/${org.slug}`}
          </a>
        </p>
        <p className="mt-2 text-sm text-mute">Widget-avain: {org.widget_key}</p>
      </div>
    </main>
  );
}
