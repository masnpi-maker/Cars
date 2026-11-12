import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Car } from '../types/database';
import RatingSummary from './RatingSummary';
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
        <div className="community-rating-label">Bendruomenės įvertinimas</div>
        <RatingSummary average={car.average_rating} count={car.review_count} />
        {userRating != null && (
          <div className="my-rating">
            <span className="my-rating-label">Jūsų įvertinimas · {userRating}/10</span>
            <StarRating value={userRating} />
          </div>
        )}
        <Link to={`/cars/${car.id}`} className="rate-link">
          Vertinti automobilį <span>↗</span>
        </Link>
      </div>
    </article>
  );
}
