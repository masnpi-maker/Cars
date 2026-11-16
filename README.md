# Car Design Rating

Lietuviška elektromobilių dizaino vertinimo aplikacija. Lankytojai gali peržiūrėti dešimties automobilių katalogą, atverti nuotraukų galerijas ir palyginti bendruomenės įvertinimus. Prisijungę vartotojai gali skirti automobiliui balą nuo 1 iki 10, o administratorius – peržiūrėti projekto statistiką.

## Funkcijos

- Dešimties elektromobilių katalogas su nuotraukomis iš `Foto/` aplanko.
- Atskirų automobilių puslapiai su nuotraukų galerija ir įvertinimo forma.
- Bendruomenės reitingai pagal įvertinimų vidurkį.
- Registracija, prisijungimas ir vartotojo profilis.
- Administravimo skydelis su vartotojų, įvertinimų ir automobilių statistika.
- Pasirenkami el. pašto pranešimai administratoriui apie naują įvertinimą.

## Technologijos

- React 18, TypeScript ir Vite
- React Router
- Tailwind CSS
- Supabase Auth ir PostgreSQL
- Supabase Edge Functions ir Resend el. laiškams

## Paleidimas lokaliai

Reikalingas Node.js 20 arba naujesnis ir npm.

1. Įdiekite priklausomybes:

   ```sh
   npm install
   ```

2. Nukopijuokite `.env.example` į `.env` ir įrašykite Supabase projekto URL bei viešą anoniminį raktą:

   ```env
   VITE_SUPABASE_URL=https://jusu-projektas.supabase.co
   VITE_SUPABASE_ANON_KEY=jusu-anoniminis-raktas
   ```

   Šiuos duomenis rasite Supabase projekto API nustatymuose. Nenaudokite `service_role` rakto naršyklės aplikacijoje.

3. Paleiskite kūrimo serverį:

   ```sh
   npm run dev
   ```

   Atverkite terminale nurodytą vietinį adresą.

Be Supabase konfigūracijos veikia vietinis automobilių katalogas ir nuotraukos. Prisijungimui, įvertinimų išsaugojimui, reitingams ir administravimo skydeliui reikalingas sukonfigūruotas Supabase projektas.

## Supabase konfigūravimas

1. Sukurkite Supabase projektą ir įsitikinkite, kad `.env` faile nustatyti `VITE_SUPABASE_URL` bei `VITE_SUPABASE_ANON_KEY`.
2. Supabase SQL redaktoriuje paleiskite `supabase/migrations/202611110001_initial.sql`. Migracija sukuria automobilių ir įvertinimų lenteles, prieigos taisykles (RLS), reitingų suvestinę, administratoriaus funkcijas ir dešimties automobilių įrašus.
3. Užregistruokite vartotoją aplikacijoje. Jei reikia administratoriaus, SQL redaktoriuje priskirkite rolę savo paskyrai, pakeitę el. paštą:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin'
   from auth.users
   where email = 'jus@example.com'
   on conflict (user_id) do update set role = excluded.role;
   ```

   Administratoriaus prieiga tikrinama duomenų bazėje. Vartotojai negali patys sau suteikti šios rolės.
4. Supabase Authentication URL nustatymuose įrašykite vietinės ir paskelbtos aplikacijos adresus. El. pašto patvirtinimą galite valdyti Supabase Auth nustatymuose.

### El. pašto pranešimai (pasirinktinai)

1. Įdiekite Supabase CLI ir įdiekite funkciją:

   ```sh
   supabase functions deploy notify-new-review
   ```

2. Nustatykite funkcijos paslaptis. Toliau pateiktas reikšmes pakeiskite savomis:

   ```sh
   supabase secrets set RESEND_API_KEY=re_... ADMIN_EMAIL=admin@example.com REVIEW_WEBHOOK_SECRET=ilgas-atsitiktinis-raktas
   ```

   Šių reikšmių nedėkite į `VITE_` kintamuosius ar į naršyklės kodą. `SUPABASE_URL` ir `SUPABASE_SERVICE_ROLE_KEY` funkcijai pateikia Supabase aplinka.
3. Įjunkite `Vault` ir `pg_net` plėtinius, jei jie dar neįjungti. `Vault` sukurkite paslaptis `project_url` (Supabase projekto URL) ir `review_webhook_secret` (tą pačią reikšmę kaip `REVIEW_WEBHOOK_SECRET`).
4. Paleiskite `supabase/migrations/202611110002_review_notification.sql`.

Pranešimas siunčiamas tik sukūrus naują įvertinimą. Atnaujinus jau esamą to paties vartotojo įvertinimą, el. laiškas nesiunčiamas.

## Nuotraukos

Kiekvieno automobilio nuotraukos laikomos atskirame `Foto/` pakatalogyje. `0.jpg` naudojama kaip pagrindinė nuotrauka, o kataloge esančios sunumeruotos nuotraukos rodomos automobilio galerijoje. Vite šiuos failus įtraukia į svetainės paketą; nuotraukoms nereikia Supabase Storage.

## Projekto komandos

```sh
npm run dev      # paleisti kūrimo serverį
npm run build    # patikrinti TypeScript ir sukurti produkcinį paketą
npm run preview  # peržiūrėti produkcinį paketą lokaliai
```

## Struktūra

```text
src/
  components/    bendri vartotojo sąsajos komponentai
  hooks/         autentifikacijos kontekstas
  pages/         katalogo, automobilio, reitingų ir paskyrų puslapiai
  services/      Supabase, automobilių, nuotraukų ir įvertinimų logika
  types/         duomenų tipai
supabase/
  functions/     Edge Function el. pašto pranešimams
  migrations/    duomenų bazės schemos ir funkcijų migracijos
Foto/            automobilių nuotraukos
```
