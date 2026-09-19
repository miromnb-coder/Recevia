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
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center px-6 py-12">
        <h1 className="text-center text-[28px] font-semibold tracking-tight">Kirjaudu</h1>

        <button
          type="button"
          onClick={() => setNotice("Google-kirjautuminen tulee pian.")}
          className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-white text-sm font-medium"
        >
          <GoogleMark />
          Kirjaudu Googlella
        </button>

        <div className="my-7 h-px bg-line" />

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Sähköposti
            <input
              required
              name="email"
              type="email"
              className="mt-2 h-12 w-full rounded-full border border-line bg-white px-4 text-sm font-normal outline-none focus:border-ink"
            />
          </label>
          <label className="block text-sm font-medium">
            Salasana
            <input
              required
              name="password"
              type="password"
              className="mt-2 h-12 w-full rounded-full border border-line bg-white px-4 text-sm font-normal outline-none focus:border-ink"
            />
          </label>
          <button
            disabled={pending}
            type="submit"
            className="h-12 w-full rounded-full bg-ink text-sm font-medium text-white disabled:bg-[#C4C4C4]"
          >
            {pending ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </form>

        {notice ? <p className="mt-4 text-center text-sm text-mute">{notice}</p> : null}

        <p className="mt-6 text-center text-sm text-mute">
          Ei tiliä vielä?{" "}
          <Link href="/signup" className="text-ink underline">
            Luo tili
          </Link>
        </p>
      </main>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.9 2-1.8 2.6v2.1h3c1.8-1.6 2.8-4 2.8-6.3Z" />
      <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-3-2.1c-.8.6-1.9.9-3 .9-2.3 0-4.3-1.6-5-3.7H1v2.2C2.4 15.9 5.5 18 9 18Z" />
      <path fill="#FBBC05" d="M4 10.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V4.9H1C.4 6.2 0 7.6 0 9s.4 2.8 1 4.1l3-2.2Z" />
      <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.5-2.5C13.5.9 11.4 0 9 0 5.5 0 2.4 2.1 1 4.9l3 2.2C4.7 5.2 6.7 3.6 9 3.6Z" />
    </svg>
  );
}
