import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRankings } from '../services/rankings';
import type { Car } from '../types/database';
import { carImage } from '../services/carImages';

export default function Rankings() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getRankings()
      .then((results) => {
        if (!cancelled) setCars(results);
      })
      .catch(() => {
        if (!cancelled) setError('Reitingų suvestinė Supabase dar neparuošta. Paleiskite supabase/repair_rating_summary.sql Supabase SQL Editor lange.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <main className="rank-page section-wrap">
      <div className="eyebrow">KOMUNITETAS · REITINGAI</div>
      <h1>Dizaino <em>viršūnė.</em></h1>
      <p className="rank-intro">Automobilių reitingas pagal bendruomenės įvertinimus.</p>
      {error && <div className="notice error">{error}</div>}
      {loading && <div className="page-loading">Kraunami reitingai…</div>}
      {!loading && !error && cars.length === 0 && (
        <div className="notice">Reitingų nėra. Pirmieji įvertinimai dar laukiami.</div>
      )}
      {!error && cars.length > 0 && (
        <div className="ranking-list">
          {cars.map((car, index) => (
            <Link to={`/cars/${car.id}`} className="rank-row" key={car.id}>
              <b className="rank-no">{String(index + 1).padStart(2, '0')}</b>
              <img src={carImage(car)} alt={`${car.brand} ${car.model}`} />
              <div className="rank-name">
                <span>{car.brand}</span>
                <strong>{car.model}</strong>
              </div>
              <div className="rank-score">
                {car.review_count ? car.average_rating?.toFixed(1) : '—'}
                <small>{car.review_count ? `${car.review_count} įvertinimų` : 'Dar neįvertintas'}</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
