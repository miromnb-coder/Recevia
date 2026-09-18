# Recevia

AI-vastaanottaja yrityksille. Yksi alusta, jokaiselle yritykselle oma agentti.

Recevia vastaa asiakkaalle 24/7, kerää liidit ja varaa ajat. Chat, WhatsApp ja SMS ovat kanavia. Takana on aina sama agentti, sama tietämys ja sama kalenteri.

**Lupaus:** Luo yrityksellesi AI-vastaanottaja muutamassa minuutissa.

## Tila

Repo oli tyhjä 18.9.2026. V1 rakennetaan tähän repoon vaiheittain.

| Versio | Mitä | Ei vielä |
|---|---|---|
| V1 MVP | Website-widget, AI-chat, liidit, Google Calendar, dashboard, 2 tenanttia | WhatsApp, SMS, ääni, Stripe |
| V2 | Sama agentti + WhatsApp | SMS |
| V3 | SMS + itsepalvelu + billing | Oma CRM-tuote |

## Pino

Next.js 15 · TypeScript · Tailwind · Supabase (Auth + Postgres + RLS) · OpenAI · Google Calendar · Resend · Vercel

## Vaiheet

0. Bootstrap (tämä README)
1. Next.js + landing
2. Supabase-skeema ja RLS
3. Auth ja organization
4. Tietämys + system prompt
5. `/api/chat` + preview `/w/[slug]`
6. Dashboard: keskustelut ja liidit
7. Google Calendar ja varaus
8. Sähköposti-ilmoitukset
9. 7-askeleen onboarding
10. Embed-widget
11. Vercel-demo

Yksityiskohtainen työohje: `Recevia-rakennussuunnitelma.docx` projektikansiossa.

## Sääntö

Main on aina ajettavissa. Yksi vaihe kerrallaan. Chat-polku ennen kalenteria. Kalenteri ennen wizardia. Ei WhatsAppia ennen kuin `/w/helsinki-dental` varaa oikean ajan Googleen.

## Paikallinen ajo

Ohjeet tulevat vaiheessa 1 (`npm run dev`). Älä commitoi `.env.local`-tiedostoa.
