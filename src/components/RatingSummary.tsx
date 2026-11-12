import StarRating from './StarRating';

export default function RatingSummary({ average, count }: { average: number | null; count: number }) {
  if (!count) {
    return <div className="summary"><span>Dar neįvertintas</span></div>;
  }

  return (
    <div className="summary">
      <StarRating value={Math.round(average || 0)} />
      <span>{average?.toFixed(1)} · {count} {count === 1 ? 'įvertinimas' : 'įvertinimų'}</span>
    </div>
  );
}
