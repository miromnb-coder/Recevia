"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HandoffButton({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    await fetch(`/api/conversations/${id}/handoff`, { method: "POST" });
    setPending(false);
    router.refresh();
  }

  if (status === "handoff") {
    return <p className="text-sm text-teal">Handoff</p>;
  }

  return (
    <button type="button" onClick={onClick} disabled={pending} className="rounded-full border border-navy/15 px-4 py-2 text-sm text-navy disabled:opacity-60">
      {pending ? "Merkitaan..." : "Handoff"}
    </button>
  );
}
