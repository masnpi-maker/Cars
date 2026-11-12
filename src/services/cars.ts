import {supabase} from './supabase'; import type {Car} from '../types/database';import {localCars} from './localCars';
export async function getCars():Promise<Car[]>{
  if(!supabase)return localCars;
  const summary=await supabase.from('car_rating_summary').select('*').order('brand');
  if(!summary.error&&summary.data?.length)return summary.data as Car[];

  // The summary view may be absent or missing from PostgREST's schema cache.
  // Read the real car UUIDs directly so submitted reviews reference valid rows.
  const cars=await supabase.from('cars').select('id,brand,model,image_url').order('brand');
  if(cars.error||!cars.data?.length)return localCars;
  return cars.data.map(car=>({...car,average_rating:null,review_count:0})) as Car[];
}
export async function getCar(id:string):Promise<Car|null>{
  const localCar=localCars.find(car=>car.id===id)||null;
  if(!supabase)return localCar;
  const summary=await supabase.from('car_rating_summary').select('*').eq('id',id).maybeSingle();
  if(!summary.error&&summary.data)return summary.data as Car;
  const car=await supabase.from('cars').select('id,brand,model,image_url').eq('id',id).maybeSingle();
  return car.error||!car.data?localCar:{...car.data,average_rating:null,review_count:0} as Car;
}
