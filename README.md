# CarDesign Rating

Responsive React + Vite + TypeScript app for rating the design of ten electric cars. Supabase provides authentication, PostgreSQL storage, RLS, aggregate ratings, protected admin RPCs, and an Edge Function email notification sent through Resend.

## Run locally

1. Install Node.js 20+ and npm.
2. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase **Project Settings → API**.
3. Run `npm install`, then `npm run dev`.
4. Open the local URL Vite prints.

Without Supabase keys, the UI can load but account, catalog, rating, ranking, and admin data cannot work.

## Supabase setup

1. Create a Supabase project.
2. Apply `supabase/migrations/202611110001_initial.sql` in the SQL Editor (or link the project with the Supabase CLI and run `supabase db push`). This creates the cars and reviews tables, RLS, aggregate view, admin role table, admin RPCs, indexes, and the ten seed cars.
3. Register your account in the app, then assign it the admin role in SQL Editor:

   ```sql
   insert into public.user_roles(user_id, role)
   select id, 'admin' from auth.users where email = 'you@example.com'
   on conflict (user_id) do update set role = excluded.role;
   ```

   Admin status is checked by the `is_admin()` security-definer function and `admin_dashboard()` checks authorization again on the server. Users cannot grant themselves a role.
4. In Authentication → URL Configuration, set the local and deployed app URLs. Email confirmation can be enabled in Supabase Auth settings.

### Email notifications

1. Deploy the Edge Function: `supabase functions deploy notify-new-review`. The function disables platform JWT verification and checks a separate shared webhook secret header instead.
2. Set the function secrets (never put these in `.env`):

   ```sh
   supabase secrets set RESEND_API_KEY=re_... ADMIN_EMAIL=admin@example.com REVIEW_WEBHOOK_SECRET=<long-random-secret>
   ```

   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are available to deployed Edge Functions in Supabase. The service key is only used server-side to look up the car name.
3. Enable the Vault and `pg_net` extensions if the project has not enabled them. Add two Vault secrets named `project_url` (the project URL, such as `https://abc.supabase.co`) and `review_webhook_secret` (the same random secret used for `REVIEW_WEBHOOK_SECRET`). Then apply `supabase/migrations/202611110002_review_notification.sql`.

The database trigger fires only after an INSERT. Updating an existing user's rating does not send another email. The Edge Function rejects requests without the shared webhook secret.

## Security and data model

- Cars and `car_rating_summary` are publicly readable. Cars have no client write policies.
- Review rows are readable only by their owner; public clients receive aggregate counts and averages through the view.
- Review inserts and updates require `auth.uid() = user_id`. The database enforces integer ratings 1–10 and one row per user/car; the app uses an upsert for repeat ratings.
- Admin dashboard access is protected by server-side role checks. To revoke access, delete the user's row from `public.user_roles`.

## Checks

- `npm run build` runs TypeScript checking and a Vite production build.
- Apply the SQL migrations and use two test accounts to verify that one account cannot access the other's review row or admin data. Use an admin account to confirm dashboard totals and that review insert sends one email while update sends none.
- Actual Auth, database, and email behavior requires project credentials and a deployed Supabase project; these are not included in this repository.

## Image sources

Seed records use representative Unsplash-hosted images. Replace the `image_url` values with licensed image URLs or upload approved car photos to a public Supabase Storage bucket for stable production hosting.
