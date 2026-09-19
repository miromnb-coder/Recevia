import { NextResponse } from "next/server";
import { getCurrentOrgId } from "@/lib/org";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { supabase, organizationId } = await getCurrentOrgId();
  if (!organizationId) {
    return NextResponse.json({ error: "Ei sessiota." }, { status: 401 });
  }

  const { error } = await supabase
    .from("conversations")
    .update({ status: "handoff" })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
