"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mark } from "@/components/brand";

export default function SignupPage() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const company = String(form.get("company") ?? "").trim();
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setPending(false);
      setNotice(error.message);
      return;
    }
    const response = await fetch("/api/onboarding/create-org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company }),
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      setNotice(payload.error ?? "Tilin luonti epäonnistui.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Mark className="h-6 w-6" /> Recevia
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">Luo vastaanottaja</h1>
        <p className="mt-2 text-sm text-mute">Yrityksen nimi riittää alkuun.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-white p-6 shadow-card">
          <label className="block text-sm">
            Yrityksen nimi
            <input required name="company" className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
          </label>
          <label className="block text-sm">
            Sähköposti
            <input required type="email" name="email" className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
          </label>
          <label className="block text-sm">
            Salasana
            <input required type="password" name="password" minLength={8} className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
          </label>
          <button disabled={pending} type="submit" className="w-full rounded-full bg-ink py-3 text-sm text-white disabled:opacity-60">
            {pending ? "Luodaan..." : "Aloita ilmaiseksi"}
          </button>
        </form>
        {notice ? <p className="mt-4 text-sm text-mute">{notice}</p> : null}
        <p className="mt-6 text-sm text-mute">
          Onko tili jo olemassa? <Link href="/login" className="text-ink underline">Kirjaudu</Link>
        </p>
      </main>
    </div>
  );
}
