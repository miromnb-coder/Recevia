import Link from "next/link";
import { Mark } from "@/components/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mark className="h-7 w-7" />
            Recevia
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-mute md:flex">
            <a href="#ominaisuudet">Ominaisuudet</a>
            <a href="#miten">Miten toimii</a>
            <a href="#hinnat">Hinnat</a>
          </nav>
          <div className="flex items-center gap-2 text-sm">
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
              <a href="#demo" className="rounded-full border border-line bg-white px-5 py-3 text-sm">Katso demo</a>
            </div>
          </div>
          <div id="demo">
            <img
              src="/hero-inbox.jpeg"
              alt="Recevia-keskustelu, vapaat ajat ja ilmoitukset"
              className="w-full rounded-[28px]"
            />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[0.85fr_1.35fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Kaikki yhdessä hallinnassa.</h2>
            <p className="mt-4 max-w-sm text-mute">
              Seuraa keskusteluja, liidejä, varauksia ja kalenteria – yhdessä helppokäyttöisessä näkymässä.
            </p>
            <Link href="#ominaisuudet" className="mt-6 inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm">
              Katso kaikki ominaisuudet →
            </Link>
          </div>
          <img
            src="/dashboard-preview.jpeg"
            alt="Recevia-dashboard Helsinki Dental"
            className="w-full rounded-[28px]"
          />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Helppo ottaa käyttöön.</h2>
          <p className="mt-2 text-mute">Saat Recevian käyttöön vain muutamassa minuutissa.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["1", "Lisää yrityksesi", "Syötä verkkosivujesi URL-osoite."],
              ["2", "Yhdistä kalenteri", "Linkitä Google Calendar."],
              ["3", "Testaa vastaanottaja", "Kokeile kysymyksiä ja varausprosessia."],
              ["4", "Julkaise", "Kopioi verkkosivujesi widget."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-3xl border border-line bg-white p-5">
                <p className="text-xs text-mute">{n}</p>
                <p className="mt-3 font-medium">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-mute">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="ominaisuudet" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Enemmän kuin chatbot.</h2>
          <p className="mt-3 max-w-xl text-mute">
            Recevia hoitaa koko asiakasviestinnän puolestasi – älykkäästi, nopeasti ja luotettavasti.
          </p>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["chat", "Vastaa kysymyksiin", "Auttaa asiakkaita heti, 24/7."],
              ["lead", "Kerää liidejä", "Tunnistaa kiinnostuneet ja tallentaa tiedot."],
              ["cal", "Varaa ajat", "Suoraan kalenteristasi, ilman manuaalista työtä."],
              ["follow", "Seuraa jälkihoitoa", "Vahvistaa varaukset ja pitää yhteyttä."],
              ["clock", "Toimii 24/7", "Ei nuku, ei lomaa."],
            ].map(([icon, t, d]) => (
              <div key={t}>
                <Icon name={icon} />
                <p className="mt-4 font-medium">{t}</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-mute">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="miten" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Näin se toimii.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {[
              ["1", "Asiakas kysyy", "Esim. verkkosivujen chatissa."],
              ["2", "Recevia vastaa", "Ystävällisesti ja ammattimaisesti."],
              ["3", "Saatavuus tarkistetaan", "Kalenteristasi reaaliaikaisesti."],
              ["4", "Aika varataan", "Asiakas saa vahvistuksen."],
              ["5", "Liidi tallennetaan", "Tiedot siirtyvät asiakasrekisteriisi."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-3xl border border-line bg-white p-5">
                <p className="text-xs text-mute">{n}</p>
                <p className="mt-6 font-medium">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-mute">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight">Monikanavainen. Yksi äly.</h2>
            <p className="mt-3 text-mute">
              Sama Recevia AI toimii kaikissa kanavissa ja käyttää samaa asiakastietoa ja keskusteluhistoriaa.
            </p>
          </div>
          <img
            src="/recevia-channels.jpeg"
            alt="Recevia AI yhdistää Website Chatin, WhatsAppin ja SMS:n"
            className="mx-auto mt-10 w-full max-w-4xl"
          />
        </section>

        <section id="hinnat" className="mx-auto max-w-6xl px-5 py-8">
          <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-8 text-center">
            <p className="text-lg font-medium">Hinnat · pian julkaistaan</p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Voit aloittaa jo nyt. Julkinen hinnasto tulee, kun V1 on testattu.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 text-center">
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

function Icon({ name }: { name: string }) {
  const common = "h-10 w-10 text-ink";
  if (name === "chat") {
    return (
      <svg viewBox="0 0 40 40" className={common} fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13 16.5h14M13 20.5h10M13 24.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "lead") {
    return (
      <svg viewBox="0 0 40 40" className={common} fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
        <path d="M20 13v8l5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "cal") {
    return (
      <svg viewBox="0 0 40 40" className={common} fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
        <rect x="13" y="15" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13 19h14M17 13v4M23 13v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "follow") {
    return (
      <svg viewBox="0 0 40 40" className={common} fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
        <path d="M14 22h12M14 18h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className={common} fill="none" aria-hidden>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M20 16.5V20l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
