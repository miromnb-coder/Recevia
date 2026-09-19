import Link from "next/link";
import type { ReactNode } from "react";
import { Mark } from "@/components/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 py-4">
          <Link href="/" className="flex items-center gap-2 justify-self-start font-semibold">
            <Mark className="h-7 w-7" />
            Recevia
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-mute md:flex">
            <a href="#ominaisuudet">Ominaisuudet</a>
            <a href="#miten">Miten toimii</a>
            <a href="#hinnat">Hinnat</a>
          </nav>
          <div className="flex items-center justify-self-end gap-2 text-sm">
            <Link href="/login" className="hidden rounded-full px-4 py-2 md:inline">Kirjaudu</Link>
            <Link href="/signup" className="rounded-full bg-ink px-4 py-2 text-white">Aloita ilmaiseksi</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-mute">AI-vastaanottaja</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              AI-vastaanottaja, joka muuttaa viestit ajanvarauksiksi.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mute">
              Vastaa asiakkaillesi 24/7, kerää liidit ja varaa ajat suoraan kalenteriisi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-full bg-ink px-5 py-3 text-sm text-white">Aloita ilmaiseksi</Link>
              <a href="#demo" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm">
                <PlayIcon />
                Katso demo
              </a>
            </div>
          </div>
          <div id="demo">
            <ImageWell>
              <img
                src="/hero-inbox.jpeg"
                alt="Recevia-keskustelu, vapaat ajat ja ilmoitukset"
                className="relative z-10 w-full rounded-[22px] bg-white"
              />
            </ImageWell>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 md:grid-cols-[0.85fr_1.35fr] md:py-20">
          <div className="md:pt-6">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Kaikki yhdessä hallinnassa.</h2>
            <p className="mt-4 max-w-sm text-mute">
              Seuraa keskusteluja, liidejä, varauksia ja kalenteria – yhdessä helppokäyttöisessä näkymässä.
            </p>
            <Link href="#ominaisuudet" className="mt-6 inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm">
              Katso kaikki ominaisuudet →
            </Link>
          </div>
          <ImageWell>
            <img
              src="/dashboard-preview.jpeg"
              alt="Recevia-dashboard Helsinki Dental"
              className="relative z-10 w-full rounded-[22px] bg-white"
            />
          </ImageWell>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Helppo ottaa käyttöön.</h2>
          <p className="mt-2 text-mute">Saat Recevian käyttöön vain muutamassa minuutissa.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start">
            <SetupStep n="1" title="Lisää yrityksesi" text="Syötä verkkosivujesi URL-osoite.">
              <div className="mt-4 rounded-xl border border-line bg-mist px-3 py-2 text-xs text-mute">www.yrityksesi.fi</div>
            </SetupStep>
            <Arrow />
            <SetupStep n="2" title="Yhdistä kalenteri" text="Linkitä Google Calendar.">
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#4285F4] text-[8px] text-white">G</span>
                Yhdistä Google Calendar
              </div>
            </SetupStep>
            <Arrow />
            <SetupStep n="3" title="Testaa vastaanottaja" text="Kokeile kysymyksiä ja varausprosessia.">
              <div className="mt-4 inline-flex rounded-full border border-line bg-white px-3 py-1.5 text-xs">Testaa nyt</div>
            </SetupStep>
            <Arrow />
            <SetupStep n="4" title="Julkaise" text="Kopioi verkkosivujesi widget.">
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-xs">
                <span className="text-mute">&lt;/&gt;</span> Kopioi koodi
              </div>
            </SetupStep>
          </div>
        </section>

        <section id="ominaisuudet" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Enemmän kuin chatbot.</h2>
          <p className="mt-3 max-w-xl text-mute">
            Recevia hoitaa koko asiakasviestinnän puolestasi – älykkäästi, nopeasti ja luotettavasti.
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon="chat" title="Vastaa kysymyksiin" text="Auttaa asiakkaita heti, 24/7." />
            <Feature icon="megaphone" title="Kerää liidejä" text="Tunnistaa kiinnostuneet ja tallentaa tiedot." />
            <Feature icon="cal" title="Varaa ajat" text="Suoraan kalenteristasi, ilman manuaalista työtä." />
            <Feature icon="list" title="Seuraa jälkihoitoa" text="Vahvistaa varaukset ja pitää yhteyttä." />
            <Feature icon="clock" title="Toimii 24/7" text="Ei nuku, ei lomaa." />
          </div>
        </section>

        <section id="miten" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Näin se toimii.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
            <FlowCard n="1" icon="ask" title="Asiakas kysyy" text="Esim. verkkosivujen chatissa." />
            <Arrow />
            <FlowCard n="2" icon="reply" title="Recevia vastaa" text="Ystävällisesti ja ammattimaisesti." />
            <Arrow />
            <FlowCard n="3" icon="check" title="Saatavuus tarkistetaan" text="Kalenteristasi reaaliaikaisesti." />
            <Arrow />
            <FlowCard n="4" icon="book" title="Aika varataan" text="Asiakas saa vahvistuksen." />
            <Arrow />
            <FlowCard n="5" icon="save" title="Liidi tallennetaan" text="Tiedot siirtyvät asiakasrekisteriisi." />
          </div>
        </section>

        <section className="mx-auto max-w-6xl overflow-hidden px-5 py-16 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Monikanavainen. Yksi äly.</h2>
              <p className="mt-3 max-w-md text-mute">
                Sama Recevia AI toimii kaikissa kanavissa ja käyttää samaa asiakastietoa ja keskusteluhistoriaa.
              </p>
            </div>
            <ImageWell className="px-4 py-8 md:px-6 md:py-10">
              <div className="relative z-10">
                <ChannelDiagram />
              </div>
            </ImageWell>
          </div>
        </section>

        <section id="hinnat" className="px-5 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Anna Recevian hoitaa vastaanotto.</h2>
          <p className="mx-auto mt-4 max-w-lg text-mute">
            Vastaa nopeammin. Kerää enemmän liidejä. Varaa enemmän aikoja.
          </p>
          <Link href="/signup" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm text-white">
            Aloita ilmaiseksi
          </Link>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-8 text-center text-xs text-mute">
        Recevia · yksi vastaanottaja per yritys
      </footer>
    </div>
  );
}

function ImageWell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`image-well rounded-[32px] p-3 md:p-5 ${className}`.trim()}>
      {children}
    </div>
  );
}

function SetupStep({
  n,
  title,
  text,
  children,
}: {
  n: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <p className="text-xs text-mute">{n}</p>
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-mute">{text}</p>
      {children}
    </div>
  );
}

function FlowCard({
  n,
  icon,
  title,
  text,
}: {
  n: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <p className="text-xs text-mute">{n}</p>
      <div className="mt-4 text-ink">
        <MiniIcon name={icon} />
      </div>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-mute">{text}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <MiniIcon name={icon} />
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-mute">{text}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center self-center text-mute md:flex" aria-hidden>
      →
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M5 3.5v9l8-4.5-8-4.5Z" />
    </svg>
  );
}

function ChannelDiagram() {
  return (
    <div className="flex w-full flex-col items-center gap-4 py-2 md:grid md:max-w-lg md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-3 md:py-2">
      <div className="order-1 md:order-2">
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-line bg-white shadow-sm md:h-36 md:w-36">
          <Mark className="h-10 w-10 md:h-12 md:w-12" />
          <p className="mt-2 text-xs font-medium">Recevia AI</p>
        </div>
      </div>
      <div className="order-2 w-full max-w-xs md:order-1 md:flex md:justify-end">
        <ChannelCard icon="web" title="Website Chat" sub="Verkkosivut" />
      </div>
      <div className="order-3 flex w-full max-w-xs flex-col gap-3 md:gap-6">
        <ChannelCard icon="wa" title="WhatsApp" sub="Tulossa" />
        <ChannelCard icon="sms" title="SMS" sub="Tulossa" />
      </div>
    </div>
  );
}

function ChannelCard({
  icon,
  title,
  sub,
}: {
  icon: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2 shadow-sm md:w-auto">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${icon === "wa" ? "bg-[#25D366] text-white" : "bg-ink text-white"}`}>
        {icon === "wa" ? <WaGlyph /> : <BubbleGlyph />}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-xs text-mute">{sub}</p>
      </div>
    </div>
  );
}

function BubbleGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M4 4.5h8v5.5H7.2L4 12.2V4.5Z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function WaGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 2.4a5.6 5.6 0 0 0-4.8 8.4L2.6 13.4l2.7-.7A5.6 5.6 0 1 0 8 2.4Zm2.6 7.7c-.1.3-.7.6-1 .7-.3 0-.6 0-1-.1-.2 0-.5-.2-.9-.4-1.6-.8-2.6-2.5-2.7-2.6-.1-.1-.6-.8-.6-1.6 0-.8.4-1.1.5-1.3.2-.2.3-.2.4-.2h.3c.1 0 .2 0 .4.3l.4 1.1c0 .1 0 .2 0 .3l-.2.2-.3.3c-.1.1-.2.2-.1.3.1.2.6.9 1.2 1.2.8.3 1 .3 1.2.2.2-.1.4-.4.5-.5.1-.1.2-.1.3 0l1.1.5c.2.1.3.1.3.2.1.1 0 .4-.1.8Z" />
    </svg>
  );
}

function MiniIcon({ name }: { name: string }) {
  const cls = "h-6 w-6";
  if (name === "chat" || name === "ask") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
        <path d="M5 6.5h14v8.5H10l-5 3V6.5Z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (name === "megaphone") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
        <path d="M5 10.5v3h3l8 3.5V7L8 10.5H5Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9.5 13.5v2.2a1.8 1.8 0 0 1-1.8 1.8H7" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (name === "cal" || name === "book" || name === "check") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
        <rect x="5" y="6.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 10h14M9 4.5v3M15 4.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "list") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
        <path d="M8 7h11M8 12h11M8 17h11M5 7h.01M5 12h.01M5 17h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 8.5V12l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 18c.8-2.4 2.7-3.5 5.5-3.5s4.7 1.1 5.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
