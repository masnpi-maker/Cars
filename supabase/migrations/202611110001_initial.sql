create extension if not exists pgcrypto;

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  image_url text,
  constraint cars_brand_model_unique unique (brand, model)
);
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  car_id uuid not null references public.cars(id) on delete cascade,
  rating integer not null check (rating between 1 and 10),
  created_at timestamptz not null default now(),
  constraint reviews_user_car_unique unique(user_id, car_id)
);
create index if not exists reviews_car_id_idx on public.reviews(car_id);
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

alter table public.cars enable row level security;
alter table public.reviews enable row level security;
create policy "cars are publicly readable" on public.cars for select using (true);
create policy "users can read their own review" on public.reviews for select to authenticated using (auth.uid() = user_id);
create policy "users can create their own review" on public.reviews for insert to authenticated with check (auth.uid() = user_id);
create policy "users can update their own review" on public.reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The view owner can aggregate reviews while callers only receive public totals.
create or replace view public.car_rating_summary as
select c.id,c.brand,c.model,c.image_url,round(avg(r.rating)::numeric,1) as average_rating,count(r.id)::integer as review_count
from public.cars c left join public.reviews r on r.car_id=c.id group by c.id;
grant select on public.cars, public.car_rating_summary to anon, authenticated;
grant select on public.reviews to authenticated;
grant insert, update on public.reviews to authenticated;

create table if not exists public.user_roles(user_id uuid primary key references auth.users(id) on delete cascade, role text not null check(role in ('admin')));
alter table public.user_roles enable row level security;
revoke all on public.user_roles from anon, authenticated;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.user_roles where user_id=auth.uid() and role='admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_dashboard() returns jsonb language plpgsql stable security definer set search_path=public as $$
declare result jsonb;
begin
 if not public.is_admin() then raise exception 'admin access required' using errcode='42501'; end if;
 select jsonb_build_object(
  'users',(select count(*) from auth.users),
  'reviews',(select count(*) from public.reviews),
  'cars',(select coalesce(jsonb_agg(to_jsonb(s) order by s.average_rating desc nulls last,s.review_count desc), '[]'::jsonb) from public.car_rating_summary s),
  'recent',(select coalesce(jsonb_agg(x), '[]'::jsonb) from (select c.brand,c.model,r.rating,r.created_at from public.reviews r join public.cars c on c.id=r.car_id order by r.created_at desc limit 10) x)
 ) into result;
 return result;
end $$;
revoke all on function public.admin_dashboard() from public;
grant execute on function public.admin_dashboard() to authenticated;

insert into public.cars(brand,model,image_url) values
('BMW','iX3','https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85'),
('BYD','Sealion 7','https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1400&q=85'),
('Mercedes-Benz','CLA','https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85'),
('Renault','5','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85'),
('Škoda','Elroq','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=85'),
('Škoda','Enyaq','https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85'),
('Tesla','Model 3','https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1400&q=85'),
('Tesla','Model Y','https://images.unsplash.com/photo-1566055909643-a51b4271aa47?auto=format&fit=crop&w=1400&q=85'),
('Volkswagen','ID.4','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85'),
('Volvo','EX30','https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85')
on conflict(brand,model) do update set image_url=excluded.image_url;

-- Create the admin role through the Supabase SQL editor after registering:
-- insert into public.user_roles(user_id, role) select id, 'admin' from auth.users where email = 'YOUR_ADMIN_EMAIL';
