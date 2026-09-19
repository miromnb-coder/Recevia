const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal"]);

function isPrivateHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return true;
  if (host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(host)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(host)) return true;
  return false;
}

export function normalizeWebsite(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Verkkosivu puuttuu.");
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Vain http- ja https-osoitteet.");
  }
  if (isPrivateHost(url.hostname)) {
    throw new Error("Tätä osoitetta ei voi lukea.");
  }
  url.hash = "";
  return url;
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPage(url: URL) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "ReceviaBot/1.0 (+https://recevia-lemon.vercel.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) return "";
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text") && !contentType.includes("html") && contentType !== "") {
      return "";
    }
    const html = (await response.text()).slice(0, 500_000);
    return stripHtml(html).slice(0, 12_000);
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchSiteText(raw: string) {
  const home = normalizeWebsite(raw);
  const extras = ["/yhteystiedot", "/palvelut", "/contact", "/services", "/aukioloajat"];
  const pages = [await fetchPage(home)];
  for (const path of extras) {
    const extra = new URL(path, home.origin);
    const text = await fetchPage(extra);
    if (text) pages.push(text);
  }
  const combined = pages.filter(Boolean).join("\n\n");
  if (combined.length < 40) {
    throw new Error("Sivulta ei saatu tarpeeksi tekstiä.");
  }
  return { url: home.toString(), hostname: home.hostname, text: combined.slice(0, 18_000) };
}
