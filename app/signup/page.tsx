"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [notice, setNotice] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Tilin luonti kytketään vaiheessa 3. Silloin syntyy organization ja oma agentti.");
  }

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <header className="px-6 py-6">
        <Link href="/" className="text-lg font-semibold text-navy">
          Recevia
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">
          Luo vastaanottaja
        </h1>
        <p className="mt-2 text-sm text-navy/60">
          Yrityksen nimi riittää alkuun. Verkkosivu ja kalenteri tulevat wizardissa.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-navy/10 bg-white p-6"
        >
          <label className="block text-sm text-navy/80">
            Yrityksen nimi
            <input
              required
              name="company"
              className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2 outline-none ring-teal/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm text-navy/80">
            Sähköposti
            <input
              required
              type="email"
              name="email"
              className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2 outline-none ring-teal/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm text-navy/80">
            Salasana
            <input
              required
              type="password"
              name="password"
              minLength={8}
              className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2 outline-none ring-teal/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-teal py-3 text-sm font-medium text-white hover:bg-[#0c5c60]"
          >
            Jatka
          </button>
        </form>
        {notice ? <p className="mt-4 text-sm text-teal">{notice}</p> : null}
        <p className="mt-6 text-sm text-navy/60">
          Onko tili jo olemassa?{" "}
          <Link href="/login" className="text-teal underline">
            Kirjaudu
          </Link>
        </p>
      </main>
    </div>
  );
}
