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
const dayNames: Record<string, string> = {
  ma: "mon",
  mon: "mon",
  ti: "tue",
  tue: "tue",
  ke: "wed",
  wed: "wed",
  to: "thu",
  thu: "thu",
  pe: "fri",
  fri: "fri",
  la: "sat",
  sat: "sat",
  su: "sun",
  sun: "sun",
};

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

function applySlot(
  days: Record<string, { open: string; close: string } | null>,
  from: string,
  to: string,
  open: string,
  close: string,
) {
  const order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const start = order.indexOf(from);
  const end = order.indexOf(to);
  if (start < 0 || end < 0 || !open || !close) return;
  for (let i = start; i <= end; i += 1) {
    days[order[i]] = { open, close };
  }
}

function parseHoursBlob(value: unknown, days: Record<string, { open: string; close: string } | null>) {
  if (!value) return days;
  if (typeof value === "string") {
    const range = value.match(/(ma|ti|ke|to|pe|la|su)\s*[-–—]\s*(ma|ti|ke|to|pe|la|su)\s+(\d{1,2}[.:]\d{2})\s*[-–—]\s*(\d{1,2}[.:]\d{2})/i);
    if (range) {
      applySlot(days, dayNames[range[1].toLowerCase()], dayNames[range[2].toLowerCase()], normalizeTime(range[3]), normalizeTime(range[4]));
    }
    return days;
  }
  if (typeof value !== "object") return days;
  const record = value as Record<string, unknown>;
  for (const [rawKey, rawRow] of Object.entries(record)) {
    const key = dayNames[rawKey.toLowerCase()] ?? rawKey;
    if (rawRow && typeof rawRow === "object") {
      const open = normalizeTime(String((rawRow as { open?: string }).open ?? ""));
      const close = normalizeTime(String((rawRow as { close?: string }).close ?? ""));
      if (open && close && key in days) days[key] = { open, close };
    }
  }
  const openWeekdays = weekdayKeys.filter((key) => days[key]);
  if (openWeekdays.length === 1 && days.mon) {
    for (const key of weekdayKeys) days[key] = days.mon;
  }
  return days;
}

function firstPhone(texts: string[]) {
  for (const text of texts) {
    const match = text.match(/(\+358[\d\s()/.-]{6,}|0\d[\d\s()-]{6,})/);
    if (match) return match[1].replace(/\s+/g, " ").trim();
  }
  return null;
}

function firstAddress(texts: string[]) {
  for (const text of texts) {
    const match = text.match(/([A-ÄÖÅa-äöå][A-ÄÖÅa-äöå\- ]+\s+\d+[A-Za-z]?(?:,)?\s+\d{5}\s+[A-ÄÖÅa-äöå]+)/);
    if (match) return match[1].replace(/^osoite on\s+/i, "").replace(/\.$/, "").trim();
  }
  return null;
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
            "Poimi yritystiedot sivun tekstistä. Palauta JSON jossa on AINA: greeting, phone, address, hours, services, faqs.",
            "phone ja address omiin kenttiin, ei vain FAQ:hon.",
            "hours-objektissa avaimet mon,tue,wed,thu,fri,sat,sun. Jos sivulla ma-pe, täytä kaikki arkipäivät.",
            "Kellonajat HH:MM. Älä keksi hintoja. services vähintään 3 riviä jos sivulla mainitaan palveluita.",
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

  const faqText = faqs.map((item) => `${item.question} ${item.answer}`).join("\n");
  const blob = [input.text, faqText, JSON.stringify(parsed)];

  const hours = emptyHours();
  parseHoursBlob(parsed.hours, hours.days);
  parseHoursBlob(faqText, hours.days);
  parseHoursBlob(input.text, hours.days);

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

  return {
    greeting: String(parsed.greeting ?? "").trim() || "Miten voin auttaa tänään?",
    phone: String(parsed.phone ?? "").trim() || firstPhone(blob),
    address: String(parsed.address ?? "").trim() || firstAddress(blob),
    rules: `Verkkosivu: ${input.website}`,
    hours,
    services,
    faqs,
  } satisfies ExtractedBusiness;
}
