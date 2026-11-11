import type {Car} from '../types/database';

// The directory names match the folders in the project's Foto directory.
export const localCars: Car[] = [
  ['local-bmw-ix3','BMW','iX3'],
  ['local-byd-sealion-7','BYD','Sealion 7'],
  ['local-mercedes-cla','Mercedes-Benz','CLA'],
  ['local-renault-5','Renault','5'],
  ['local-skoda-elroq','Škoda','Elroq'],
  ['local-skoda-enyaq','Škoda','Enyaq'],
  ['local-tesla-model-3','Tesla','Model 3'],
  ['local-tesla-model-y','Tesla','Model Y'],
  ['local-volkswagen-id-4','Volkswagen','ID.4'],
  ['local-volvo-ex30','Volvo','EX30'],
].map(([id,brand,model])=>({id,brand,model,image_url:null,average_rating:null,review_count:0}));
