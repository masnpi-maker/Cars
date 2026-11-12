import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Car } from '../types/database';
import StarRating from './StarRating';
import { carImage } from '../services/carImages';

export default function CarCard({ car, userRating }: { car: Car; userRating?: number }) {
  return (
    <article className="car-card">
      <Link to={`/cars/${car.id}`} className="car-image">
        <img src={carImage(car)} alt={`${car.brand} ${car.model}`} loading="lazy" />
        <span className="image-arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="card-copy">
        <Link to={`/cars/${car.id}`} className="car-name">
          <span>{car.brand}</span>
          <strong>{car.model}</strong>
        </Link>
        {car.review_count > 0 ? (
          <div className="summary community-rating">
            Bendruomenės reitingas: {car.average_rating?.toFixed(1)} · {car.review_count} {car.review_count === 1 ? 'įvertinimas' : 'įvertinimų'}
          </div>
        ) : userRating == null ? (
          <div className="summary">Dar neįvertintas</div>
        ) : null}
        {userRating != null && (
          <div className="my-rating">
            <span className="my-rating-label">Jūsų įvertinimas · {userRating}/10</span>
            <StarRating value={userRating} />
          </div>
        )}
        <Link to={`/cars/${car.id}`} className="rate-link">Vertinti automobilį <span>↗</span></Link>
      </div>
    </article>
  );
}
