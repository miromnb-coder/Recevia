"use client";

import { FormEvent, useMemo, useState } from "react";

type Bubble = { role: "user" | "assistant"; content: string };

export function PreviewChat({
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

  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Bubble[]>([{ role: "assistant", content: greeting }]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setPending(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        widget_key: widgetKey,
        session_id: sessionId,
        message: text,
      }),
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(payload.error ?? "Viestiä ei voitu lähettää.");
      return;
    }
    setMessages((prev) => [...prev, { role: "assistant", content: payload.reply }]);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col px-6 pb-8">
      <p className="text-xs text-mute">Esikatselu</p>
      <h1 className="mt-1 text-2xl font-semibold">{company}</h1>
      <div className="mt-6 flex flex-1 flex-col gap-3">
        {messages.map((item, index) => (
          <div
            key={index}
            className={item.role === "user" ? "self-end rounded-2xl bg-ink px-4 py-2 text-sm text-white" : "self-start rounded-2xl border border-line bg-white px-4 py-2 text-sm"}
          >
            {item.content}
          </div>
        ))}
        {pending ? <p className="text-sm text-mute">Kirjoittaa...</p> : null}
      </div>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Kirjoita viesti"
          className="flex-1 rounded-full border border-line bg-white px-4 py-3 text-sm outline-none"
        />
        <button disabled={pending} className="rounded-full bg-ink px-4 py-3 text-sm text-white disabled:opacity-60">
          Lähetä
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-mute">{error}</p> : null}
    </main>
  );
}
