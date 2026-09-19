import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { PreviewChat } from "./chat";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createServiceClient();
  const { data: org } = await admin
    .from("organizations")
    .select("id, name, slug, widget_key")
    .eq("slug", slug)
    .maybeSingle();

  if (!org) notFound();

  const { data: profile } = await admin
    .from("business_profiles")
    .select("greeting")
    .eq("organization_id", org.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-sand">
      <header className="mx-auto flex max-w-lg items-center justify-between px-6 py-6">
        <p className="text-sm font-semibold text-navy">Recevia</p>
        <p className="text-sm text-navy/60">{org.name}</p>
      </header>
      <PreviewChat
        company={org.name}
        widgetKey={org.widget_key}
        greeting={profile?.greeting || "Miten voin auttaa tanaan?"}
      />
    </div>
  );
}
