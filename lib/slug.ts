export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\u00e4]/g, "a")
    .replace(/[\u00f6]/g, "o")
    .replace(/[\u00e5]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "yritys";
}

export function widgetKey() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return (
    "wk_" +
    Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  );
}
