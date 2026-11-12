import {useEffect,useState} from 'react';
import {ArrowDownRight} from 'lucide-react';
import CarCard from '../components/CarCard';
import {getCars} from '../services/cars';
import {ownReviews} from '../services/reviews';
import type {Car} from '../types/database';
import {configured} from '../services/supabase';
import {useAuth} from '../hooks/useAuth';

export default function Home(){
  const [cars,setCars]=useState<Car[]>([]);
  const [ownRatings,setOwnRatings]=useState<Record<string,number>>({});
  const [error,setError]=useState('');
  const {session}=useAuth();

  useEffect(()=>{
    let active=true;
    getCars().then(data=>{if(active)setCars(data)}).catch(e=>{if(active)setError(e.message)});
    return()=>{active=false};
  },[]);

  useEffect(()=>{
    let active=true;
    if(!session?.user){setOwnRatings({});return()=>{active=false}}
    if(!cars.length)return()=>{active=false};
    ownReviews(cars.map(car=>car.id)).then(data=>{if(active)setOwnRatings(data)}).catch(e=>{if(active)setError(e.message)});
    return()=>{active=false};
  },[cars,session?.user?.id]);

  return <main><section className="hero"><div className="hero-inner"><div className="eyebrow"><span/> NEPRIKLAUSOMAS DIZAINO VERTINIMAS</div><h1>Forma, kuri<br/><em>palieka įspūdį.</em></h1><p>Įvertinkite šiandienos elektromobilių dizainą.<br/>Jūsų nuomonė formuoja rytojaus kelią.</p><a href="#cars" className="hero-cta">Atrasti automobilius <ArrowDownRight size={18}/></a><div className="hero-index">01 <span>/ 10</span><i/></div></div><div className="hero-photo"><img src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=90" alt="Šiuolaikinio elektromobilio dizainas"/><span className="photo-caption">DESIGN MOVES US · 2025</span></div></section><section id="cars" className="catalog section-wrap"><div className="section-heading"><div><div className="eyebrow">KATALOGAS · 2026</div><h2>Pasirinkite <em>savo favoritą.</em></h2></div><span className="catalog-count">01 — 10</span></div>{!configured&&<div className="notice">Automobilių nuotraukos įkeliamos iš projekto <code>Foto</code> aplanko. Supabase reikalingas prisijungimui ir vertinimų išsaugojimui.</div>}{error&&<div className="notice error">Nepavyko gauti automobilių: {error}</div>}<div className="car-grid">{cars.map(car=><CarCard key={car.id} car={car} ownRating={ownRatings[car.id]}/>)}</div>{configured&&!cars.length&&!error&&<div className="page-loading">Kraunamas katalogas…</div>}</section></main>
}
