export type ExtractedBusiness = {
  greeting: string;
  phone: string | null;
  address: string | null;
  rules: string | null;
  hours: {
    timezone: string;
    days: Record<string, { open: string; close: string } | null>;
  };
  services: Array<{ name: string; duration_min: number; price_from: number | null; description: string | null }>;
  faqs: Array<{ question: string; answer: string }>;
};

const weekdayKeys = ["mon", "tue", "wed", "thu", "fri"] as const;

function emptyHours() {
  return {
    timezone: "Europe/Helsinki",
    days: {
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null,
    } as Record<string, { open: string; close: string } | null>,
  };
}

function normalizeTime(value: string) {
  const cleaned = value.trim().replace(".", ":").replace(",", ":");
  const match = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function expandWeekdays(days: Record<string, { open: string; close: string } | null>) {
  const openWeekdays = weekdayKeys.filter((key) => days[key]);
  if (openWeekdays.length === 1 && days.mon) {
    for (const key of weekdayKeys) {
      if (!days[key]) days[key] = days.mon;
    }
  }
  return days;
}

export async function extractBusinessFromText(input: {
  company: string;
  website: string;
  text: string;
}) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) throw new Error("OPENAI_API_KEY puuttuu.");

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "Poimi yritystiedot sivun tekstistä JSON-muodossa.",
            "Älä keksi hintoja. Jos hintaa ei löydy, price_from on null.",
            "Jos sivulla lukee ma-pe, ma–pe tai arkisin, täytä mon,tue,wed,thu,fri samoilla ajoilla.",
            "Kellonajat muodossa HH:MM, esim. 7.30 → 07:30.",
            "greeting: yksi suomenkielinen lause tämän yrityksen alalle.",
            "services: 4-8 erillistä palvelua sivun listoista (huolto, korjaus, katsastus, ilmastointi jne.).",
            "faqs: 4-8 kysymystä sivun faktoista (aukiolo, osoite, mitä tehdään, ajanvaraus). Älä jätä FAQ:ta tyhjäksi jos sivulla on yhteystiedot tai palveluita.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            company: input.company,
            website: input.website,
            text: input.text,
          }),
        },
      ],
    }),
  });

  if (!completion.ok) {
    const err = await completion.text();
    throw new Error(`OpenAI: ${err.slice(0, 200)}`);
  }

  const data = await completion.json();
  const raw = String(data.choices?.[0]?.message?.content ?? "{}");
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    parsed = {};
  }

  const hours = emptyHours();
  const incomingHours = parsed.hours;
  if (incomingHours && typeof incomingHours === "object") {
    for (const key of Object.keys(hours.days)) {
      const row = (incomingHours as Record<string, unknown>)[key];
      if (row && typeof row === "object") {
        const open = normalizeTime(String((row as { open?: string }).open ?? ""));
        const close = normalizeTime(String((row as { close?: string }).close ?? ""));
        hours.days[key] = open && close ? { open, close } : null;
      }
    }
  }
  hours.days = expandWeekdays(hours.days);

  const services = Array.isArray(parsed.services)
    ? parsed.services
        .map((item) => {
          const row = item as Record<string, unknown>;
          return {
            name: String(row.name ?? "").trim(),
            duration_min: Number(row.duration_min) || 30,
            price_from: row.price_from == null || row.price_from === "" ? null : Number(row.price_from),
            description: row.description ? String(row.description) : null,
          };
        })
        .filter((item) => item.name)
        .slice(0, 8)
    : [];

  const faqs = Array.isArray(parsed.faqs)
    ? parsed.faqs
        .map((item) => {
          const row = item as Record<string, unknown>;
          return {
            question: String(row.question ?? "").trim(),
            answer: String(row.answer ?? "").trim(),
          };
        })
        .filter((item) => item.question && item.answer)
        .slice(0, 10)
    : [];

  return {
    greeting: String(parsed.greeting ?? "").trim() || "Miten voin auttaa tänään?",
    phone: String(parsed.phone ?? "").trim() || null,
    address: String(parsed.address ?? "").trim() || null,
    rules: `Verkkosivu: ${input.website}`,
    hours,
    services,
    faqs,
  } satisfies ExtractedBusiness;
}
