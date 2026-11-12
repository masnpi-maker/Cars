import { supabase } from './supabase';
import { localCars } from './localCars';
import type { Car } from '../types/database';

export async function getRankings(): Promise<Car[]> {
  if (!supabase) return localCars;

  const { data, error } = await supabase
    .from('car_rating_summary')
    .select('*')
    .order('average_rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false });

  if (error) throw error;
  return (data || []) as Car[];
}
