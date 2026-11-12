import { supabase } from './supabase';

export async function ownRatings(userId: string, carIds: string[]): Promise<Record<string, number>> {
  if (!supabase || !userId || !carIds.length) return {};

  const { data, error } = await supabase
    .from('reviews')
    .select('car_id,rating')
    .eq('user_id', userId)
    .in('car_id', carIds);

  if (error) throw error;
  return Object.fromEntries((data || []).map((review) => [review.car_id, review.rating]));
}
