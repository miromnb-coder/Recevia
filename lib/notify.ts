export async function notifyOwner(input: {
  to: string | null | undefined;
  subject: string;
  text: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = String(input.to ?? "").trim();
  if (!key || !to) return { skipped: true as const };

  const from = process.env.NOTIFY_FROM || "Recevia <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { skipped: false as const, error: body.slice(0, 200) };
  }
  return { skipped: false as const };
}
