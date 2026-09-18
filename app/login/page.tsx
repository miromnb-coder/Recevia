"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <div className="flex min-h-screen flex-col bg-sand">
      <header className="px-6 py-6">
        <Link href="/" className="text-lg font-semibold text-navy">Recevia</Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">Kirjaudu Receviaan</h1>
        <p className="mt-2 text-sm text-navy/60">Omistajan nakyma aukeaa kirjautumisen jalkeen.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-navy/10 bg-white p-6">
          <label className="block text-sm text-navy/80">
            Sahkoposti
            <input required name="email" type="email" className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2 outline-none ring-teal/30 focus:ring-2" />
          </label>
          <label className="block text-sm text-navy/80">
            Salasana
            <input required name="password" type="password" className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2 outline-none ring-teal/30 focus:ring-2" />
          </label>
          <button disabled={pending} type="submit" className="w-full rounded-full bg-navy py-3 text-sm font-medium text-white hover:bg-ink disabled:opacity-60">
            {pending ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </form>
        {notice ? <p className="mt-4 text-sm text-teal">{notice}</p> : null}
        <p className="mt-6 text-sm text-navy/60">
          Ei tilia viela? <Link href="/signup" className="text-teal underline">Luo vastaanottaja</Link>
        </p>
      </main>
    </div>
  );
}
