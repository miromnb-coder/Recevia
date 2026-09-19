import Link from "next/link";
import { Mark } from "@/components/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mark className="h-6 w-6" />
            Recevia
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-mute md:flex">
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
              src="/hero-inbox.jpg"
              alt="Recevia-keskustelu, vapaat ajat ja ilmoitukset"
              className="w-full rounded-[28px]"
            />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.3fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Kaikki yhdessä hallinnassa.</h2>
            <p className="mt-4 max-w-sm text-mute">
              Seuraa keskusteluja, liidejä, varauksia ja kalenteria yhdessä näkymässä.
            </p>
            <Link href="#ominaisuudet" className="mt-6 inline-block text-sm">Katso kaikki ominaisuudet →</Link>
          </div>
          <img
            src="/dashboard-preview.jpg"
            alt="Recevia-dashboard Helsinki Dental"
            className="w-full rounded-[28px]"
          />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Helppo ottaa käyttöön.</h2>
          <p className="mt-2 text-mute">Saat Recevian käyttöön muutamassa minuutissa.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["1", "Lisää yrityksesi", "Kerro nimi, palvelut ja sivusto."],
              ["2", "Yhdistä kalenteri", "Linkitä Google Calendar."],
              ["3", "Testaa vastaanottaja", "Kokeile kysymyksiä ja varausta."],
              ["4", "Julkaise", "Kopioi widget sivullesi."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-3xl border border-line bg-white p-5">
                <p className="text-xs text-mute">{n}</p>
                <p className="mt-3 font-medium">{t}</p>
                <p className="mt-2 text-sm text-mute">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="ominaisuudet" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Enemmän kuin chatbot.</h2>
          <p className="mt-3 max-w-xl text-mute">Recevia hoitaa asiakasviestinnän puolestasi.</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Vastaa kysymyksiin", "Auttaa asiakkaita heti, 24/7."],
              ["Kerää liidejä", "Tunnistaa kiinnostuneet ja tallentaa tiedot."],
              ["Varaa ajat", "Suoraan kalenteristasi, ilman manuaalista työtä."],
              ["Seuraa jälkihoitoa", "Vahvistaa varaukset ja pitää yhteyttä."],
              ["Toimii 24/7", "Ei nuku, ei lomaa."],
              ["Yksi agentti", "Chat nyt. WhatsApp ja SMS myöhemmin."],
            ].map(([t, d]) => (
              <div key={t}>
                <p className="font-medium">{t}</p>
                <p className="mt-2 text-sm text-mute">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="miten" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Näin se toimii.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              ["1", "Asiakas kysyy"],
              ["2", "Recevia vastaa"],
              ["3", "Saatavuus tarkistetaan"],
              ["4", "Aika varataan"],
              ["5", "Liidi tallennetaan"],
            ].map(([n, t]) => (
              <div key={n} className="rounded-3xl border border-line bg-white p-5">
                <p className="text-xs text-mute">{n}</p>
                <p className="mt-4 font-medium">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Monikanavainen. Yksi äly.</h2>
          <p className="mt-3 max-w-xl text-mute">Sama Recevia käyttää yhtä tietämystä. Extra-kanavat merkitään tulossa.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <span className="rounded-full border border-line bg-white px-4 py-2 text-sm">Website Chat</span>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white"><Mark className="h-8 w-8" /></span>
            <span className="rounded-full border border-line bg-white px-4 py-2 text-sm text-mute">WhatsApp · tulossa</span>
            <span className="rounded-full border border-line bg-white px-4 py-2 text-sm text-mute">SMS · tulossa</span>
          </div>
        </section>

        <section id="hinnat" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Hinnat</h2>
          <div className="mt-6 max-w-xl rounded-3xl border border-line bg-white p-8">
            <p className="text-lg font-medium">Pian julkaistaan</p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Voit aloittaa jo nyt. Julkinen hinnasto tulee, kun V1 on testattu.
            </p>
            <Link href="/signup" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-sm text-white">Aloita ilmaiseksi</Link>
          </div>
        </section>

        <section className="px-5 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Anna Recevian hoitaa vastaanotto.</h2>
          <p className="mx-auto mt-4 max-w-lg text-mute">Vastaa nopeammin. Kerää enemmän liidejä. Varaa enemmän aikoja.</p>
          <Link href="/signup" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm text-white">Aloita ilmaiseksi</Link>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-8 text-center text-xs text-mute">
        Recevia · yksi vastaanottaja per yritys
      </footer>
    </div>
  );
}
