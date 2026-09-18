"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [notice, setNotice] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Kirjautuminen kytketään vaiheessa 3, kun Supabase Auth tulee mukaan.");
  }

  return (
    <AuthShell
      title="Kirjaudu Receviaan"
      subtitle="Omistajan näkymä aukeaa seuraavissa vaiheissa."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Sähköposti" name="email" type="email" />
        <Field label="Salasana" name="password" type="password" />
        <button
          type="submit"
          className="w-full rounded-full bg-navy py-3 text-sm font-medium text-white hover:bg-ink"
        >
          Kirjaudu
        </button>
      </form>
      {notice ? <p className="mt-4 text-sm text-teal">{notice}</p> : null}
      <p className="mt-6 text-sm text-navy/60">
        Ei tiliä vielä?{" "}
        <Link href="/signup" className="text-teal underline">
          Luo vastaanottaja
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <header className="px-6 py-6">
        <Link href="/" className="text-lg font-semibold text-navy">
          Recevia
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">{title}</h1>
        <p className="mt-2 text-sm text-navy/60">{subtitle}</p>
        <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-6">{children}</div>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <label className="block text-sm text-navy/80">
      {label}
      <input
        required
        name={name}
        type={type}
        className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2 text-navy outline-none ring-teal/30 focus:ring-2"
      />
    </label>
  );
}
