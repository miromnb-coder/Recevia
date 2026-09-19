type Service = { name: string; duration_min: number; price_from: number | null; description: string | null };
type Faq = { question: string; answer: string };
type Profile = {
  greeting: string | null;
  phone: string | null;
  address: string | null;
  language: string | null;
  rules: string | null;
  hours: unknown;
};

function hoursText(hours: unknown) {
  if (!hours || typeof hours !== "object") return "Aukioloa ei ole tallennettu.";
  const days = (hours as { days?: Record<string, { open?: string; close?: string } | null> }).days;
  if (!days) return "Aukioloa ei ole tallennettu.";
  const labels: Record<string, string> = {
    mon: "ma",
    tue: "ti",
    wed: "ke",
    thu: "to",
    fri: "pe",
    sat: "la",
    sun: "su",
  };
  return Object.entries(labels)
    .map(([key, label]) => {
      const row = days[key];
      if (!row?.open || !row?.close) return `${label}: suljettu`;
      return `${label}: ${row.open}\u2013${row.close}`;
    })
    .join("\n");
}

export function buildPromptSnapshot(input: {
  company: string;
  profile: Profile;
  services: Service[];
  faqs: Faq[];
}) {
  const services = input.services
    .map((s) => {
      const price = s.price_from == null ? "hinta ei tiedossa" : `alkaa ${s.price_from} EUR`;
      return `- ${s.name}, ${s.duration_min} min, ${price}${s.description ? `. ${s.description}` : ""}`;
    })
    .join("\n");

  const faqs = input.faqs.map((f) => `K: ${f.question}\nV: ${f.answer}`).join("\n\n");

  return [
    `Olet Recevian vastaanottaja yritykselle ${input.company}.`,
    `Kieli: ${input.profile.language || "fi"}. Vastaa asiakkaan kielella.`,
    "Jokaisessa viestissa: 1) lyhyt reaktio 2) vastaus 3) yksi kysymys. Pelkkaan numeroon ei reaktiota.",
    "Kielletty: huutomerkit, Hi there, keksimasi hinta tai vapaa aika, konehuoneen paljastaminen (sahkoposti, CRM, tiimiin ilmoittaminen).",
    "Jos et tieda: sano ettet ole varma ja pyyda nimi + puhelin.",
    input.profile.rules ? `Saannot: ${input.profile.rules}` : "",
    `Tervehdys: ${input.profile.greeting || "Miten voin auttaa tanaan?"}`,
    `Puhelin: ${input.profile.phone || "ei annettu"}`,
    `Osoite: ${input.profile.address || "ei annettu"}`,
    "Aukiolo:",
    hoursText(input.profile.hours),
    "Palvelut ja hinnat (kayta vain naita hintoja):",
    services || "Ei palveluita viela.",
    "FAQ:",
    faqs || "Ei FAQ-riveja viela.",
  ]
    .filter(Boolean)
    .join("\n\n");
}
