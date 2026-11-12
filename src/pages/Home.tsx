import { useEffect, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import CarCard from '../components/CarCard';
import { getCars } from '../services/cars';
import { ownRatings } from '../services/userRatings';
import { localCars } from '../services/localCars';
import type { Car } from '../types/database';
import { configured } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [cars, setCars] = useState<Car[]>(localCars);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [ratingsOwnerId, setRatingsOwnerId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setUserRatings({});
    setRatingsOwnerId(null);

    async function loadCatalog() {
      let catalog: Car[];
      try {
        catalog = await getCars();
      } catch {
        if (!cancelled) {
          setCars(localCars);
          setUserRatings({});
        }
        return;
      }

      if (cancelled) return;
      setCars(catalog);
      if (!userId) {
        return;
      }

      try {
        const ratings = await ownRatings(userId, catalog.map((car) => car.id));
        if (!cancelled) {
          setUserRatings(ratings);
          setRatingsOwnerId(userId);
        }
      } catch {
        if (!cancelled) setUserRatings({});
      }
    }

    void loadCatalog();
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow"><span /> NEPRIKLAUSOMAS DIZAINO VERTINIMAS</div>
          <h1>Forma, kuri<br /><em>palieka įspūdį.</em></h1>
          <p>Įvertinkite šiandienos elektromobilių dizainą.<br />Jūsų nuomonė formuoja rytojaus kelią.</p>
          <a href="#cars" className="hero-cta">Atrasti automobilius <ArrowDownRight size={18} /></a>
          <div className="hero-index">01 <span>/ 10</span><i /></div>
        </div>
        <div className="hero-photo">
          <img src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=90" alt="Šiuolaikinio elektromobilio dizainas" />
          <span className="photo-caption">DESIGN MOVES US · 2025</span>
        </div>
      </section>
      <section id="cars" className="catalog section-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">KATALOGAS · 2026</div>
            <h2>Pasirinkite <em>savo favoritą.</em></h2>
          </div>
          <span className="catalog-count">01 — 10</span>
        </div>
        {!configured && (
          <div className="notice">
            Automobilių nuotraukos įkeliamos iš projekto <code>Foto</code> aplanko.
            Supabase reikalingas prisijungimui ir vertinimų išsaugojimui.
          </div>
        )}
        <div className="car-grid">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              userRating={ratingsOwnerId === userId ? userRatings[car.id] : undefined}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
