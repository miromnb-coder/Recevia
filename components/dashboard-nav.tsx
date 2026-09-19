"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark } from "@/components/brand";

const nav = [
  ["Yhteenveto", "/dashboard"],
  ["Keskustelut", "/dashboard/conversations"],
  ["Liidit", "/dashboard/leads"],
  ["Varaukset", "/dashboard/bookings"],
  ["Tietämys", "/dashboard/knowledge"],
  ["Kalenteri", "/dashboard/calendar"],
  ["Kanavat", "/dashboard/channels"],
  ["Asetukset", "/dashboard/settings"],
];

export function DashboardNav({
  orgName,
}: {
  orgName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-line px-5 py-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <Mark className="h-5 w-5" /> Recevia
        </Link>
        <button
          type="button"
          className="rounded-full border border-line px-3 py-1.5 text-sm"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Sulje" : "Valikko"}
        </button>
      </div>

      <aside className={`${open ? "block" : "hidden"} border-b border-line bg-white px-5 py-6 md:block md:border-b-0 md:border-r`}>
        <Link href="/" className="mb-6 hidden items-center gap-2 text-sm font-semibold md:flex">
          <Mark className="h-5 w-5" /> Recevia
        </Link>
        <p className="text-sm font-medium">{orgName}</p>
        <p className="mt-0.5 text-xs text-mute">AI-vastaanottaja</p>

        <nav className="mt-8 grid gap-1 text-sm">
          {nav.map(([label, href]) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 ${active ? "bg-mist text-ink" : "text-mute hover:bg-mist hover:text-ink"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <form action="/api/auth/signout" method="post" className="mt-10">
          <button className="text-sm text-mute hover:text-ink" type="submit">
            Kirjaudu ulos
          </button>
        </form>
      </aside>
    </>
  );
}
