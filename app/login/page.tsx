"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mark } from "@/components/brand";

export default function LoginPage() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setPending(false);
    if (error) {
      setNotice(error.message);
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
        <h1 className="text-3xl font-semibold tracking-tight">Kirjaudu Receviaan</h1>
        <p className="mt-2 text-sm text-mute">Omistajan näkymä aukeaa kirjautumisen jälkeen.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-white p-6 shadow-card">
          <label className="block text-sm">
            Sähköposti
            <input required name="email" type="email" className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
          </label>
          <label className="block text-sm">
            Salasana
            <input required name="password" type="password" className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-ink" />
          </label>
          <button disabled={pending} type="submit" className="w-full rounded-full bg-ink py-3 text-sm text-white disabled:opacity-60">
            {pending ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </form>
        {notice ? <p className="mt-4 text-sm text-mute">{notice}</p> : null}
        <p className="mt-6 text-sm text-mute">
          Ei tiliä vielä? <Link href="/signup" className="text-ink underline">Luo vastaanottaja</Link>
        </p>
      </main>
    </div>
  );
}
