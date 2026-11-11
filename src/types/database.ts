export type Car = { id:string; brand:string; model:string; image_url:string|null; average_rating:number|null; review_count:number; };
export type Review = { id:string; user_id:string; car_id:string; rating:number; created_at:string; brand?:string; model?:string; };
