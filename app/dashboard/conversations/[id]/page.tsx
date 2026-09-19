import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentOrgId } from "@/lib/org";
import { HandoffButton } from "./handoff";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) redirect("/signup");

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, status, visitor_name, visitor_phone, channel, summary")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (!conversation) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  const { data: lead } = await supabase
    .from("leads")
    .select("id, name, phone, status, interest")
    .eq("conversation_id", conversation.id)
    .maybeSingle();

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <Link href="/dashboard/conversations" className="text-sm text-mute hover:text-ink">
        ← Takaisin
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {conversation.visitor_name || "Keskustelu"}
          </h1>
          <p className="mt-1 text-sm text-mute">
            {conversation.channel} · {conversation.status}
            {conversation.visitor_phone ? ` · ${conversation.visitor_phone}` : ""}
          </p>
        </div>
        <HandoffButton id={conversation.id} status={conversation.status} />
      </div>
      {lead ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm text-mute">
          Liidi: {lead.name} · {lead.phone} · {lead.status}
          {lead.interest ? ` · ${lead.interest}` : ""}
        </div>
      ) : null}
      <div className="mt-6 grid gap-3">
        {(messages ?? []).map((item) => (
          <div
            key={item.id}
            className={item.role === "user" ? "rounded-2xl bg-ink p-4 text-sm text-white" : "rounded-2xl border border-line bg-white p-4 text-sm"}
          >
            <p className="text-xs text-mute">{item.role === "user" ? "Asiakas" : "Recevia"}</p>
            <p className={`mt-1 whitespace-pre-wrap ${item.role === "user" ? "text-white" : ""}`}>{item.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
