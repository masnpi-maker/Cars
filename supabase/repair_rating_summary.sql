-- Recreate the public aggregate view used by the rankings page.
-- This exposes only totals and averages, not individual user ratings.
create or replace view public.car_rating_summary as
select
  c.id,
  c.brand,
  c.model,
  c.image_url,
  round(avg(r.rating)::numeric, 1) as average_rating,
  count(r.id)::integer as review_count
from public.cars as c
left join public.reviews as r on r.car_id = c.id
group by c.id, c.brand, c.model, c.image_url;

grant select on public.car_rating_summary to anon, authenticated;

-- Make PostgREST discover the newly-created view immediately.
notify pgrst, 'reload schema';
