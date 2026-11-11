import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, content-type'};
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});try{
 const expected=Deno.env.get('REVIEW_WEBHOOK_SECRET');if(!expected||req.headers.get('x-review-webhook-secret')!==expected)return new Response('Unauthorized',{status:401,headers:cors});
 const payload=await req.json();if(payload.type!=='INSERT'||!payload.record?.car_id||!payload.record?.rating)return new Response('Ignored',{status:200,headers:cors});
 const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;const db=createClient(url,key);
 const {data:car,error}=await db.from('cars').select('brand,model').eq('id',payload.record.car_id).single();if(error)throw error;
 const apiKey=Deno.env.get('RESEND_API_KEY'),admin=Deno.env.get('ADMIN_EMAIL');if(!apiKey||!admin)throw new Error('Missing RESEND_API_KEY or ADMIN_EMAIL');
 const date=new Date(payload.record.created_at).toLocaleString('lt-LT',{timeZone:'Europe/Vilnius'});
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:'CarDesign Rating <onboarding@resend.dev>',to:[admin],subject:`Naujas įvertinimas: ${car.brand} ${car.model}`,html:`<h2>Naujas automobilio įvertinimas</h2><p><b>Markė:</b> ${car.brand}</p><p><b>Modelis:</b> ${car.model}</p><p><b>Įvertinimas:</b> ${payload.record.rating}/10</p><p><b>Sukurta:</b> ${date}</p>`})});if(!response.ok)throw new Error(`Resend error: ${await response.text()}`);
 return new Response(JSON.stringify({ok:true}),{headers:{...cors,'Content-Type':'application/json'}});
 }catch(e){return new Response(JSON.stringify({error:(e as Error).message}),{status:500,headers:{...cors,'Content-Type':'application/json'}})}});
