"use client";

import { useState } from "react";

type Service = { name: string; duration_min: number; price_from: number | null; description: string | null };
type Faq = { question: string; answer: string };
type Hours = {
  timezone?: string;
  days?: Record<string, { open?: string; close?: string } | null>;
};

const dayOrder = [
  ["mon", "Ma"],
  ["tue", "Ti"],
  ["wed", "Ke"],
  ["thu", "To"],
  ["fri", "Pe"],
  ["sat", "La"],
  ["sun", "Su"],
] as const;

export function KnowledgeForm(props: {
  greeting: string;
  phone: string;
  address: string;
  rules: string;
  hours: Hours;
  services: Service[];
  faqs: Faq[];
  snapshot: string;
}) {
  const [greeting, setGreeting] = useState(props.greeting);
  const [phone, setPhone] = useState(props.phone);
  const [address, setAddress] = useState(props.address);
  const [rules, setRules] = useState(props.rules);
  const [days, setDays] = useState<Record<string, { open?: string; close?: string } | null>>(
    props.hours?.days ?? {},
  );
  const [services, setServices] = useState<Service[]>(
    props.services.length ? props.services : [{ name: "", duration_min: 30, price_from: null, description: "" }],
  );
  const [faqs, setFaqs] = useState<Faq[]>(
    props.faqs.length ? props.faqs : [{ question: "", answer: "" }],
  );
  const [snapshot, setSnapshot] = useState(props.snapshot);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  function setDay(key: string, field: "open" | "close" | "closed", value: string) {
    setDays((prev) => {
      if (field === "closed") {
        return { ...prev, [key]: value === "yes" ? null : { open: "08:00", close: "17:00" } };
      }
      const current = prev[key] ?? { open: "08:00", close: "17:00" };
      return { ...prev, [key]: { ...current, [field]: value } };
    });
  }

  async function onSave() {
    setPending(true);
    setNotice("");
    const response = await fetch("/api/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        greeting,
        phone,
        address,
        rules,
        hours: { timezone: "Europe/Helsinki", days },
        services: services.map((s) => ({
          ...s,
          price_from: s.price_from === null || s.price_from === ("" as unknown) ? null : Number(s.price_from),
        })),
        faqs,
      }),
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      setNotice(payload.error ?? "Tallennus epäonnistui.");
      return;
    }
    setSnapshot(payload.snapshot ?? "");
    setNotice("Tallennettu.");
  }

  return (
    <div className="mt-8 grid gap-4">
      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-medium">Yritys</h2>
        <label className="mt-4 block text-sm">
          Tervehdys
          <input value={greeting} onChange={(e) => setGreeting(e.target.value)} className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
        </label>
        <label className="mt-3 block text-sm">
          Puhelin
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
        </label>
        <label className="mt-3 block text-sm">
          Osoite
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
        </label>
        <label className="mt-3 block text-sm">
          Säännöt agentille
          <textarea value={rules} onChange={(e) => setRules(e.target.value)} className="mt-1 min-h-20 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
        </label>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-medium">Aukiolo</h2>
        <div className="mt-4 grid gap-2">
          {dayOrder.map(([key, label]) => {
            const row = days[key];
            const closed = !row;
            return (
              <div key={key} className="grid grid-cols-[2rem_1fr_1fr_auto] items-center gap-2 text-sm">
                <span>{label}</span>
                <input type="time" disabled={closed} value={row?.open ?? ""} onChange={(e) => setDay(key, "open", e.target.value)} className="rounded-lg border border-line px-2 py-1" />
                <input type="time" disabled={closed} value={row?.close ?? ""} onChange={(e) => setDay(key, "close", e.target.value)} className="rounded-lg border border-line px-2 py-1" />
                <label className="text-xs text-mute">
                  <input type="checkbox" checked={closed} onChange={(e) => setDay(key, "closed", e.target.checked ? "yes" : "no")} className="mr-1" />
                  kiinni
                </label>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Palvelut</h2>
          <button type="button" className="text-sm text-mute hover:text-ink" onClick={() => setServices((s) => [...s, { name: "", duration_min: 30, price_from: null, description: "" }])}>
            + rivi
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {services.map((s, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-mist p-3">
              <input placeholder="Nimi" value={s.name} onChange={(e) => setServices(edit(services, i, { ...s, name: e.target.value }))} className="rounded-lg border border-line bg-white px-3 py-2" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Kesto min" value={s.duration_min} onChange={(e) => setServices(edit(services, i, { ...s, duration_min: Number(e.target.value) }))} className="rounded-lg border border-line bg-white px-3 py-2" />
                <input type="number" placeholder="Hinta alkaen" value={s.price_from ?? ""} onChange={(e) => setServices(edit(services, i, { ...s, price_from: e.target.value === "" ? null : Number(e.target.value) }))} className="rounded-lg border border-line bg-white px-3 py-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">FAQ</h2>
          <button type="button" className="text-sm text-mute hover:text-ink" onClick={() => setFaqs((f) => [...f, { question: "", answer: "" }])}>
            + rivi
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {faqs.map((f, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-mist p-3">
              <input placeholder="Kysymys" value={f.question} onChange={(e) => setFaqs(edit(faqs, i, { ...f, question: e.target.value }))} className="rounded-lg border border-line bg-white px-3 py-2" />
              <textarea placeholder="Vastaus" value={f.answer} onChange={(e) => setFaqs(edit(faqs, i, { ...f, answer: e.target.value }))} className="min-h-16 rounded-lg border border-line bg-white px-3 py-2" />
            </div>
          ))}
        </div>
      </section>

      <button type="button" onClick={onSave} disabled={pending} className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white disabled:opacity-60">
        {pending ? "Tallennetaan..." : "Tallenna tietämys"}
      </button>
      {notice ? <p className="text-sm text-mute">{notice}</p> : null}

      {snapshot ? (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-medium">Prompt-snapshot</h2>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-mute">{snapshot}</pre>
        </section>
      ) : null}
    </div>
  );
}

function edit<T>(list: T[], index: number, next: T) {
  return list.map((item, i) => (i === index ? next : item));
}
