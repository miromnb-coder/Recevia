import Link from "next/link";

const pillars = [
  {
    title: "Vastaa",
    body: "Recevia vastaa asiakkaille 24/7 sivullasi. Sama agentti oppii yrityksesi palvelut, hinnat ja aukioloajat.",
  },
  {
    title: "Kerää liidit",
    body: "Jos asiakas ei varaa heti, vastaanottaja ottaa nimen ja numeron. Liidi tallentuu dashboardiin.",
  },
  {
    title: "Varaa ajat",
    body: "Agentti tarkistaa kalenterin, tarjoaa vapaat ajat ja kirjoittaa varauksen suoraan Google-kalenteriisi.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sand">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
          Recevia
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="px-3 py-2 text-navy/70 hover:text-navy">
            Kirjaudu
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-navy px-4 py-2 text-white hover:bg-ink"
          >
            Aloita
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-20">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-teal">
            AI-vastaanottaja yrityksille
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-navy md:text-6xl">
            Luo yrityksellesi AI-vastaanottaja muutamassa minuutissa.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/70">
            Älä tilaa chatbot-projektia. Recevia rakentaa yrityksellesi oman
            vastaanottajan, joka vastaa, kerää liidit ja varaa ajat. Chat,
            WhatsApp ja SMS ovat myöhemmin vain ovia samaan agenttiin.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-teal px-6 py-3 text-sm font-medium text-white hover:bg-[#0c5c60]"
            >
              Luo vastaanottaja
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-medium text-navy hover:border-navy/30"
            >
              Minulla on jo tili
            </Link>
          </div>
        </section>

        <section className="border-y border-navy/10 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
            {pillars.map((item) => (
              <div key={item.title}>
                <h2 className="text-xl font-semibold text-navy">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-navy/70">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-navy">Yksi agentti, monta ovea</h2>
          <p className="mt-3 max-w-2xl text-navy/70">
            Et rakenna kolmea bottia. Recevia luo yhden vastaanottajan. Kanavat
            liittyvät siihen kun V1 toimii.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10 bg-white">
            <div className="grid text-sm md:grid-cols-3">
              {[
                ["V1", "Website-chat, liidit, Google-kalenteri"],
                ["V2", "Sama agentti + WhatsApp"],
                ["V3", "SMS ja itsepalvelu-onboarding"],
              ].map(([label, text]) => (
                <div key={label} className="border-t border-navy/10 p-6 first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0">
                  <div className="text-xs font-medium uppercase tracking-widest text-teal">{label}</div>
                  <p className="mt-2 text-navy/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy/10 px-6 py-8 text-center text-xs text-navy/50">
        Recevia · yksi vastaanottaja per yritys
      </footer>
    </div>
  );
}
