# Recevia

AI-vastaanottaja yrityksille. Yksi alusta, jokaiselle yritykselle oma agentti.

Recevia vastaa asiakkaalle 24/7, kerää liidit ja varaa ajat. Chat, WhatsApp ja SMS ovat kanavia. Takana on aina sama agentti, sama tietämys ja sama kalenteri.

**Lupaus:** Luo yrityksellesi AI-vastaanottaja muutamassa minuutissa.

## Tila

- Vaihe 0: repo herätetty
- Vaihe 1: Next.js landing, `/login` ja `/signup` (auth tulee vaiheessa 3)
- Vaihe 2: Supabase-skeema, RLS ja seed-tenantit

## Paikallinen ajo

```bash
git clone https://github.com/miromnb-coder/Recevia.git
cd Recevia
npm install
cp .env.example .env.local
npm run dev
```

Avaa http://localhost:3000

Laita avaimet vain `.env.local`-tiedostoon. Älä commitoi sitä, äläkä liitä avaimia chattiin.

## Tietokanta

Katso `supabase/README.md`. Aja SQL Editorissa ensin `supabase/migrations/0001_init.sql`, sitten `supabase/seed.sql`.

## Pino

Next.js 15 · TypeScript · Tailwind · Supabase · OpenAI · Google Calendar · Resend · Vercel
