import {supabase} from './supabase'; import type {Car} from '../types/database';
export async function getCars():Promise<Car[]>{if(!supabase)return [];const {data,error}=await supabase.from('car_rating_summary').select('*').order('brand');if(error)throw error;return data as Car[];}
export async function getCar(id:string):Promise<Car|null>{if(!supabase)return null;const {data,error}=await supabase.from('car_rating_summary').select('*').eq('id',id).maybeSingle();if(error)throw error;return data as Car|null;}
