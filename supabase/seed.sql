-- Recevia V1 seed
-- Aja VASTA kun 0001_init.sql on ajettu.
-- Ei luo auth-kayttajia. Dashboard-kayttaja syntyy vaiheessa 3.

insert into public.organizations (id, name, slug, widget_key, allowed_domains, plan, status)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Helsinki Dental',
    'helsinki-dental',
    'wk_helsinki_dental_demo',
    array['localhost', 'helsinkidental.fi'],
    'start',
    'live'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Jyvaskyla Auto',
    'jyvaskyla-auto',
    'wk_jyvaskyla_auto_demo',
    array['localhost', 'jyvaskyla-auto.fi'],
    'start',
    'live'
  )
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  widget_key = excluded.widget_key,
  allowed_domains = excluded.allowed_domains,
  status = excluded.status;

insert into public.business_profiles (
  organization_id, greeting, tone, language, address, phone, hours, rules
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Miten voin auttaa tanaan?',
    'warm-professional',
    'fi',
    'Mannerheimintie 12, 00100 Helsinki',
    '09 123 4567',
    jsonb_build_object(
      'timezone', 'Europe/Helsinki',
      'days', jsonb_build_object(
        'mon', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'tue', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'wed', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'thu', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'fri', jsonb_build_object('open', '08:00', 'close', '16:00'),
        'sat', null,
        'sun', null
      )
    ),
    'Ei diagnoosia. Ei keksittyja hintoja. Sarky tai turvotus: anna puhelinnumero ja lopeta kartoitus.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Miten voimme auttaa auton kanssa?',
    'warm-professional',
    'fi',
    'Vapaudenkatu 40, 40100 Jyvaskyla',
    '014 123 456',
    jsonb_build_object(
      'timezone', 'Europe/Helsinki',
      'days', jsonb_build_object(
        'mon', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'tue', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'wed', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'thu', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'fri', jsonb_build_object('open', '08:00', 'close', '17:00'),
        'sat', jsonb_build_object('open', '10:00', 'close', '14:00'),
        'sun', null
      )
    ),
    'Ei kiinteaa hintaa ilman tarkastusta, paitsi listahinnat. Ei lupauksia korjausajasta ilman merkin ja mallin tietoja.'
  )
on conflict (organization_id) do update
set
  greeting = excluded.greeting,
  address = excluded.address,
  phone = excluded.phone,
  hours = excluded.hours,
  rules = excluded.rules;

delete from public.services
where organization_id in (
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222'
);

insert into public.services (
  organization_id, name, duration_min, price_from, currency, description, active
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Hammaskiven poisto',
    45,
    89.00,
    'EUR',
    'Peruspuhdistus. Hinta alkaen.',
    true
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'Tarkastus',
    30,
    75.00,
    'EUR',
    'Suun perustarkastus.',
    true
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'Hatakaynti',
    30,
    120.00,
    'EUR',
    'Sarky tai lohjennut hammas. Sama paiva jos mahdollista.',
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Maaraaikaishuolto',
    120,
    249.00,
    'EUR',
    'Huolto-ohjelman mukainen maaraaikaishuolto. Hinta alkaen, riippuu merkkista.',
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Katsastuspalvelu',
    60,
    99.00,
    'EUR',
    'Katsastus ja tarvittaessa esivalmistelu.',
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Vianetsinta',
    60,
    89.00,
    'EUR',
    'Tarkastusmaksu. Vähennetaan korjauksesta jos tyo jaa meille.',
    true
  );

delete from public.knowledge_items
where organization_id in (
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222'
);

insert into public.knowledge_items (
  organization_id, kind, question, answer
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'hours',
    'Milloin olette auki?',
    'Olemme auki ma-to 8-17 ja pe 8-16. Viikonloppuisin suljettu.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'faq',
    'Missa sijaitsette?',
    'Mannerheimintie 12, 00100 Helsinki. Ovi kadun puolelta.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'faq',
    'Mita puhdistus maksaa?',
    'Hammaskiven poisto alkaa 89 eurosta. Tarkka hinta varmistuu kaynnilla.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'policy',
    'Voitteko kertoa mika hammas vaivaa?',
    'Emme tee diagnoosia chatissa. Jos sarkee tai turvottaa, soita numeroon 09 123 4567.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'faq',
    'Hyvaksytteko Kela-korvauksen?',
    'Kyllä, Kelakorvaus vahennetaan kaynnin yhteydessa kun Kela-kortti on mukana.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'hours',
    'Milloin olette auki?',
    'Olemme auki ma-pe 8-17 ja la 10-14. Sunnuntaisin suljettu.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'faq',
    'Missa sijaitsette?',
    'Vapaudenkatu 40, 40100 Jyvaskyla. Asiakasparkki pihalla.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'faq',
    'Mita maaraaikaishuolto maksaa?',
    'Maaraaikaishuolto alkaa 249 eurosta. Lopullinen hinta riippuu merkista ja mallista.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'policy',
    'Voitteko luvata auton valmiiksi huomenna?',
    'Emme lupaa valmistumisaikaa ennen merkin, mallin ja vian kuvausta. Jata numero, niin mestari palaa.'
  );

insert into public.agent_configs (organization_id, model, system_prompt_snapshot, tools_enabled)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'gpt-4o-mini',
    'Olet Recevian vastaanottaja yritykselle Helsinki Dental. Vastaa suomeksi. Acknowledge-answer-ask. Yksi kysymys per viesti. Hinnat vain tietamyksesta. Ei diagnoosia.',
    '["get_services","create_lead","escalate"]'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'gpt-4o-mini',
    'Olet Recevian vastaanottaja yritykselle Jyvaskyla Auto. Vastaa suomeksi. Acknowledge-answer-ask. Yksi kysymys per viesti. Hinnat vain tietamyksesta. Ei keksittyja korjausaikoja.',
    '["get_services","create_lead","escalate"]'::jsonb
  )
on conflict (organization_id) do update
set
  system_prompt_snapshot = excluded.system_prompt_snapshot,
  tools_enabled = excluded.tools_enabled;
