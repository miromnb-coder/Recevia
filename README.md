# Recevia

AI-vastaanottaja yrityksille. Yksi alusta, jokaiselle yritykselle oma agentti.

## Tila

- Vaihe 0-1: landing
- Vaihe 2: Supabase-skeema ja seed
- Vaihe 3: signup luo organizationin, dashboard-kuori

## Paikallinen ajo

```bash
git pull
npm install
cp .env.example .env.local
# tayta URL, anon key ja service role
npm run dev
```

Avaa http://localhost:3000/signup

Demoa varten Supabasessa: Authentication > Providers > Email > **Confirm email = OFF**.
Muuten signup ei saa sessiota eika organization synny.

## Tietokanta

Katso `supabase/README.md`.
