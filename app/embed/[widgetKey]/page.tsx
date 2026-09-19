import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { EmbedChat } from "./chat";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ widgetKey: string }>;
}) {
  const { widgetKey } = await params;
  const admin = createServiceClient();
  const { data: org } = await admin
    .from("organizations")
    .select("id, name, widget_key")
    .eq("widget_key", widgetKey)
    .maybeSingle();

  if (!org) notFound();

  const { data: profile } = await admin
    .from("business_profiles")
    .select("greeting")
    .eq("organization_id", org.id)
    .maybeSingle();

  return (
    <div className="h-screen bg-transparent p-2">
      <EmbedChat
        company={org.name}
        widgetKey={org.widget_key}
        greeting={profile?.greeting || "Miten voin auttaa tanaan?"}
      />
    </div>
  );
}
