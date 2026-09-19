"use client";

import { FormEvent, useMemo, useState } from "react";

type Bubble = { role: "user" | "assistant"; content: string };

export function EmbedChat({
  company,
  widgetKey,
  greeting,
}: {
  company: string;
  widgetKey: string;
  greeting: string;
}) {
  const sessionId = useMemo(() => {
    const key = `recevia_session_${widgetKey}`;
    const existing = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (existing) return existing;
    const next = crypto.randomUUID();
    if (typeof window !== "undefined") localStorage.setItem(key, next);
    return next;
  }, [widgetKey]);

  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Bubble[]>([{ role: "assistant", content: greeting }]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setPending(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widget_key: widgetKey, session_id: sessionId, message: text }),
    });
    const payload = await response.json();
    setPending(false);
    if (response.ok) {
      setMessages((prev) => [...prev, { role: "assistant", content: payload.reply }]);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed bottom-3 right-3 rounded-full bg-teal px-4 py-3 text-sm text-white shadow-lg">
        Chat
      </button>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-sand shadow-xl">
      <header className="flex items-center justify-between bg-navy px-4 py-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">Recevia</p>
          <p className="text-sm font-medium">{company}</p>
        </div>
        <button onClick={() => setOpen(false)} className="text-white/70">x</button>
      </header>
      <div className="flex-1 space-y-2 overflow-auto p-3">
        {messages.map((item, index) => (
          <div key={index} className={item.role === "user" ? "ml-8 rounded-2xl bg-navy px-3 py-2 text-sm text-white" : "mr-8 rounded-2xl bg-white px-3 py-2 text-sm text-navy"}>
            {item.content}
          </div>
        ))}
        {pending ? <p className="text-xs text-navy/50">Kirjoittaa...</p> : null}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2 border-t border-navy/10 bg-white p-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Viesti" className="flex-1 rounded-full border border-navy/15 px-3 py-2 text-sm outline-none" />
        <button className="rounded-full bg-teal px-3 py-2 text-sm text-white">OK</button>
      </form>
    </div>
  );
}
