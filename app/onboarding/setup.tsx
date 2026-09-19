"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mark } from "@/components/brand";

type Mode = "scan" | "manual";

export function OnboardingSetup() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("scan");
  const [website, setWebsite] = useState("");

  function onContinue() {
    if (mode === "scan") {
      const url = website.trim();
      const query = url ? `?mode=scan&website=${encodeURIComponent(url)}` : "?mode=scan";
      router.push(`/dashboard/knowledge${query}`);
      return;
    }
    router.push("/dashboard/knowledge?mode=manual");
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <main className="mx-auto flex w-full max-w-[520px] flex-1 flex-col px-5 pb-28 pt-10">
        <div className="flex items-center gap-2 font-semibold">
          <Mark className="h-6 w-6" /> Recevia
        </div>

        <h1 className="mt-10 text-[28px] font-semibold tracking-tight">Saat vastaanottajan valmiiksi</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">
          Anna verkkosivun osoite, tai täytä tiedot itse. Automaattinen sivun luku tulee pian — nyt avataan tietämys.
        </p>

        <div className="mt-8 grid gap-3">
          <button type="button" onClick={() => setMode("scan")} className={cardClass(mode === "scan")}>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-200 via-emerald-400 to-sky-500 text-white">
              <GlobeIcon />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block font-medium">Lue verkkosivu</span>
              <span className="mt-1 block text-sm text-mute">
                · Aukioloajat<br />· Hinnat ja palvelut<br />· Valmis minuutissa
              </span>
            </span>
            {mode === "scan" ? <CheckIcon /> : null}
          </button>

          <button type="button" onClick={() => setMode("manual")} className={cardClass(mode === "manual")}>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-800 text-white">
              <EditIcon />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block font-medium">Täytä tiedot itse</span>
              <span className="mt-1 block text-sm text-mute">
                · Yrityksen tiedot<br />· Aukiolo ja palvelut<br />· Vaiheittain
              </span>
            </span>
            {mode === "manual" ? <CheckIcon /> : null}
          </button>
        </div>

        {mode === "scan" ? (
          <label className="mt-5 block text-sm font-medium">
            Verkkosivu
            <input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="www.yrityksesi.fi"
              className="mt-2 h-12 w-full rounded-full border border-line bg-white px-4 text-sm font-normal outline-none focus:border-ink"
            />
          </label>
        ) : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-white px-5 py-4">
        <div className="mx-auto flex max-w-[520px] justify-end">
          <button type="button" onClick={onContinue} className="rounded-full bg-ink px-5 py-2.5 text-sm text-white">
            Jatka
          </button>
        </div>
      </div>
    </div>
  );
}

function cardClass(active: boolean) {
  return `flex w-full items-start gap-4 rounded-[22px] border p-3 text-left ${active ? "border-ink" : "border-line"}`;
}

function CheckIcon() {
  return (
    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-white">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
        <path d="M3.5 8.2 6.4 11 12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 12h16M12 4c2.4 2.2 3.6 5 3.6 8s-1.2 5.8-3.6 8c-2.4-2.2-3.6-5-3.6-8s1.2-5.8 3.6-8Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M5 16.8V19h2.2L17 9.2 14.8 7 5 16.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13.5 8.3 15.7 10.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
