import {Star} from 'lucide-react';

export default function StarRating({value,onChange,interactive=false}:{value:number;onChange?:(n:number)=>void;interactive?:boolean}){
  return <div className="stars" role={interactive?'radiogroup':'img'} aria-label={`${value} iš 10`}>
    <span className="sr-only">Įvertinimas: {value} iš 10</span>
    {Array.from({length:10},(_,i)=><button key={i} type="button" disabled={!interactive} aria-label={`${i+1} žvaigždutės`} aria-checked={interactive?value===i+1:undefined} role={interactive?'radio':undefined} onClick={()=>onChange?.(i+1)}><Star size={interactive?30:15} fill={i<value?'#e8b83f':'transparent'} color={i<value?'#e8b83f':'#c8c8c2'}/></button>)}
  </div>
}
