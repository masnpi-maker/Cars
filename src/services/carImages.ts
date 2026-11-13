import type {Car} from '../types/database';
import bmwIx3 from '../../Foto/BMWiX3/0.jpg';
import bydSealion7 from '../../Foto/bydsealion7/0.jpg';
import mercedesCla from '../../Foto/Mercedes-BenzCLA/0.jpg';
import renault5 from '../../Foto/Renault5/0.jpg';
import skodaElroq from '../../Foto/SkodaElroq/0.jpg';
import skodaEnyaq from '../../Foto/ŠkodaEnyaq/0.jpg';
import teslaModel3 from '../../Foto/TeslaModel3/0.jpg';
import teslaModelY from '../../Foto/TeslaModelY/0.jpg';
import volkswagenId4 from '../../Foto/VolkswagenID.4/0.jpg';
import volvoEx30 from '../../Foto/VolvoEX30/0.jpg';

// These are the supplied lead shots in Foto/<model>/0.jpg. Vite imports them
// into the app bundle, so they work in both local development and production.
const leadImages: Record<string, string> = {
  'BMW|iX3': bmwIx3,
  'BYD|Sealion 7': bydSealion7,
  'Mercedes-Benz|CLA': mercedesCla,
  'Renault|5': renault5,
  'Škoda|Elroq': skodaElroq,
  'Škoda|Enyaq': skodaEnyaq,
  'Tesla|Model 3': teslaModel3,
  'Tesla|Model Y': teslaModelY,
  'Volkswagen|ID.4': volkswagenId4,
  'Volvo|EX30': volvoEx30,
};

const folders: Record<string, string> = {
  'BMW|iX3': 'BMWiX3',
  'BYD|Sealion 7': 'bydsealion7',
  'Mercedes-Benz|CLA': 'Mercedes-BenzCLA',
  'Renault|5': 'Renault5',
  'Škoda|Elroq': 'SkodaElroq',
  'Škoda|Enyaq': 'ŠkodaEnyaq',
  'Tesla|Model 3': 'TeslaModel3',
  'Tesla|Model Y': 'TeslaModelY',
  'Volkswagen|ID.4': 'VolkswagenID.4',
  'Volvo|EX30': 'VolvoEX30',
};

const galleryFiles = import.meta.glob('/Foto/**/*.{jpg,jpeg,png,avif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// The seed data and older builds may contain either the correctly encoded
// "Škoda" name or its UTF-8-as-Windows-1252 form ("Å koda"). Match both,
// and compare folder names without diacritics so the Enyaq folder is found too.
function normalized(value: string): string {
  const folded = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return folded.replace(/^akoda/, 'skoda');
}

function carKey(brand: string, model: string): string {
  const normalizedBrand = normalized(brand);
  const canonicalBrand = normalizedBrand.includes('koda') || normalizedBrand === 'akoda'
    ? 'skoda'
    : normalizedBrand;
  return `${canonicalBrand}|${normalized(model)}`;
}

export function carImage(car: Pick<Car, 'brand' | 'model' | 'image_url'>): string {
  const key = carKey(car.brand, car.model);
  const canonicalLeadImages = Object.fromEntries(
    Object.entries(leadImages).map(([entry, image]) => {
      const [brand, model] = entry.split('|');
      return [carKey(brand, model), image];
    }),
  );
  return canonicalLeadImages[key] || car.image_url || '';
}

export function carGallery(car: Pick<Car, 'brand' | 'model' | 'image_url'>): string[] {
  const key = carKey(car.brand, car.model);
  const folder = Object.entries(folders).find(([entry]) => {
    const [brand, model] = entry.split('|');
    return carKey(brand, model) === key;
  })?.[1];
  if (!folder) return carImage(car) ? [carImage(car)] : [];
  const images = Object.entries(galleryFiles)
    .filter(([path]) => path.split('/').some((part) => normalized(part) === normalized(folder)))
    .sort(([a], [b]) => {
      const number = (path: string) => Number(path.match(/\/(\d+)\.[^/.]+$/)?.[1] ?? 0);
      return number(a) - number(b);
    })
    .map(([, url]) => url);
  return images.length ? images : [carImage(car)];
}
