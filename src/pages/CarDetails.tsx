import {useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import type {Car,Review} from '../types/database';
import {getCar} from '../services/cars';
import {ownReview,saveRating} from '../services/reviews';
import {useAuth} from '../hooks/useAuth';
import StarRating from '../components/StarRating';
import RatingSummary from '../components/RatingSummary';
import {carGallery} from '../services/carImages';

export default function CarDetails(){
  const {id=''}=useParams(),{session}=useAuth();
  const [car,setCar]=useState<Car|null>(null);
  const [review,setReview]=useState<Review|null>(null);
  const [rating,setRating]=useState(0);
  const [activePhoto,setActivePhoto]=useState(0);
  const [msg,setMsg]=useState('');

  async function load(){
    const currentCar=await getCar(id);
    setCar(currentCar);
    if(session&&currentCar&&!currentCar.id.startsWith('local-')){
      const currentReview=await ownReview(id);
      setReview(currentReview);
      setRating(currentReview?.rating||0);
    }
  }

  useEffect(()=>{setActivePhoto(0);load().catch(e=>setMsg(e.message))},[id,session]);

  async function submit(){
    try{
      await saveRating(id,rating);
      setMsg('Įvertinimas sėkmingai pateiktas.');
      await load();
    }catch(e){setMsg((e as Error).message)}
  }

  if(!car)return <main className="detail-page section-wrap"><Link to="/#cars" className="back"><ArrowLeft size={16}/> Visi automobiliai</Link>{msg||'Automobilis nerastas.'}</main>;
  const photos=carGallery(car);
  const localOnly=car.id.startsWith('local-');

  return <main className="detail-page section-wrap">
    <Link to="/#cars" className="back"><ArrowLeft size={16}/> Visi automobiliai</Link>
    <div className="detail-layout">
      <div className="detail-gallery">
        <div className="detail-image">
          <img src={photos[activePhoto]||''} alt={`${car.brand} ${car.model} — nuotrauka ${activePhoto+1}`}/>
          <span className="gallery-counter">{activePhoto+1} / {photos.length}</span>
        </div>
        <div className="photo-thumbnails" aria-label={`${car.brand} ${car.model} nuotraukų galerija`}>
          {photos.map((photo,index)=><button key={photo} type="button" className={index===activePhoto?'selected':''} aria-label={`Rodyti nuotrauką ${index+1}`} aria-pressed={index===activePhoto} onClick={()=>setActivePhoto(index)}>
            <img src={photo} alt="" loading="lazy"/>
          </button>)}
        </div>
      </div>
      <div className="detail-copy">
        <div className="eyebrow">DIZAINO VERTINIMAS</div>
        <h1>{car.brand}<br/><em>{car.model}</em></h1>
        <RatingSummary average={car.average_rating} count={car.review_count}/>
        <div className="vote-box">
          <h3>{review?'Jūsų ankstesnis įvertinimas':'Kiek žvaigždučių skiriate?'}</h3>
          <StarRating value={rating} onChange={setRating} interactive/>
          <p>Pasirinkite nuo 1 iki 10</p>
          <button className="button-dark" onClick={submit} disabled={!session||rating<1||localOnly}>
            {localOnly?'Vertinti Automobili':session?'Vertinti Automobili':'Prisijunkite, kad vertintumėte'} <span>↗</span>
          </button>
          {msg&&<small className="form-message">{msg}</small>}
        </div>
      </div>
    </div>
  </main>
}
