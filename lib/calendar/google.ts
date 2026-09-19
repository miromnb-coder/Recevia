const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const PRODUCTION_APP_URL = "https://recevia-lemon.vercel.app";

export function appUrl() {
  const explicit = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");
  if (explicit && !explicit.includes("recevia.vercel.app")) return explicit;
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function googleRedirectUri() {
  return `${appUrl()}/api/calendar/callback`;
}

export function googleAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.freebusy",
    ].join(" "),
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCode(code: string) {
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirect_uri: googleRedirectUri(),
    grant_type: "authorization_code",
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || "Token exchange failed");
  return data as { refresh_token?: string; access_token: string; expires_in: number };
}

export async function accessTokenFromRefresh(refreshToken: string) {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    grant_type: "refresh_token",
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || "Refresh failed");
  return data.access_token as string;
}

function toHelsinkiParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Helsinki",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return parts;
}

function helsinkiDate(year: number, month: number, day: number, hour: number, minute: number) {
  const guess = new Date(Date.UTC(year, month - 1, day, hour - 3, minute));
  const parts = toHelsinkiParts(guess);
  const gotHour = Number(parts.hour);
  const diff = hour - gotHour;
  return new Date(guess.getTime() + diff * 60 * 60 * 1000);
}

export async function listFreeSlots(accessToken: string, durationMin: number) {
  const now = new Date();
  const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const busyRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
      items: [{ id: "primary" }],
      timeZone: "Europe/Helsinki",
    }),
  });
  const busyJson = await busyRes.json();
  const busy = (busyJson.calendars?.primary?.busy ?? []) as Array<{ start: string; end: string }>;

  const slots: string[] = [];
  for (let day = 0; day < 7 && slots.length < 6; day += 1) {
    const probe = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
    const parts = toHelsinkiParts(probe);
    const y = Number(parts.year);
    const m = Number(parts.month);
    const d = Number(parts.day);
    const weekday = new Date(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T12:00:00`).getDay();
    if (weekday === 0 || weekday === 6) continue;
    for (const hour of [9, 10, 11, 13, 14, 15]) {
      const start = helsinkiDate(y, m, d, hour, 0);
      if (start < now) continue;
      const finish = new Date(start.getTime() + durationMin * 60 * 1000);
      const overlaps = busy.some((b) => start < new Date(b.end) && finish > new Date(b.start));
      if (!overlaps) {
        slots.push(start.toISOString());
        if (slots.length >= 6) break;
      }
    }
  }
  return slots;
}

export async function createGoogleEvent(input: {
  accessToken: string;
  title: string;
  startIso: string;
  endIso: string;
  attendee?: string;
}) {
  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: input.title,
      start: { dateTime: input.startIso, timeZone: "Europe/Helsinki" },
      end: { dateTime: input.endIso, timeZone: "Europe/Helsinki" },
      attendees: input.attendee ? [{ email: input.attendee }] : [],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Event create failed");
  return data.id as string;
}
