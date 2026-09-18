# Recevia-tietokanta

Vaihe 2. Taulut, RLS ja kaksi demo-tenanttia.

## Ajo Supabasessa

1. Avaa projekti `recevia` → SQL Editor.
2. Liitä koko tiedosto `migrations/0001_init.sql` ja aja.
3. Liitä koko tiedosto `seed.sql` ja aja.
4. Aja tarkistukset alla.

Älä käytä Table Editorin “Disable RLS” -nappia. Widget ei saa lukea tauluja anon-avaimella.

## Tarkistukset

```sql
select slug, widget_key, status from public.organizations order by slug;
-- helsinki-dental | wk_helsinki_dental_demo | live
-- jyvaskyla-auto  | wk_jyvaskyla_auto_demo  | live

select o.slug, s.name, s.price_from
from public.services s
join public.organizations o on o.id = s.organization_id
order by o.slug, s.name;
```

SQL Editor käyttää service rolea, joten se NÄKEE kaikki rivit. Se on oikein. RLS testataan vaiheessa 3 kirjautuneella käyttäjällä.

## Kiinteät tunnisteet

| Yritys | slug | widget_key |
|---|---|---|
| Helsinki Dental | helsinki-dental | wk_helsinki_dental_demo |
| Jyväskylä Auto | jyvaskyla-auto | wk_jyvaskyla_auto_demo |

Nämä widget-avaimet eivät ole salaisuuksia. Ne tunnistavat tenantin.
