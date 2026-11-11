create extension if not exists pg_net with schema extensions;
create or replace function public.notify_new_review() returns trigger language plpgsql security definer set search_path=public,extensions,vault as $$
declare project_url text; hook_secret text; begin
 select decrypted_secret into project_url from vault.decrypted_secrets where name='project_url' limit 1;
 select decrypted_secret into hook_secret from vault.decrypted_secrets where name='review_webhook_secret' limit 1;
 if project_url is not null and hook_secret is not null then
  perform net.http_post(url:=rtrim(project_url,'/')||'/functions/v1/notify-new-review',headers:=jsonb_build_object('Content-Type','application/json','x-review-webhook-secret',hook_secret),body:=jsonb_build_object('type','INSERT','record',to_jsonb(NEW)));
 end if;
 return NEW;
end $$;
drop trigger if exists reviews_notify_insert on public.reviews;
create trigger reviews_notify_insert after insert on public.reviews for each row execute function public.notify_new_review();
-- Add `project_url` and `review_webhook_secret` as Vault secrets before enabling notifications.
