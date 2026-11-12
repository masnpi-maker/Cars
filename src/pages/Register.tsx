import {useState} from 'react';
import {Link} from 'react-router-dom';
import {supabase} from '../services/supabase';

export default function Register(){
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');

  async function submit(e:React.FormEvent){
    e.preventDefault();
    if(!supabase){setMsg('Supabase nėra sukonfigūruotas.');return}
    const {data,error}=await supabase.auth.signUp({
      email,
      password,
      options:{data:{username:username.trim(),name:username.trim()}},
    });
    if(error){setMsg(error.message);return}
    setMsg(data.session
      ? 'Paskyra sukurta. Dabar galite prisijungti.'
      : 'Patvirtinimo nuoroda išsiųsta į jūsų el. paštą.');
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <div className="eyebrow">TAPTI BENDRUOMENĖS DALIMI</div>
    <h1>Registruotis.</h1>
    <label>Vartotojo vardas<input type="text" required minLength={2} maxLength={30} value={username} onChange={e=>setUsername(e.target.value)}/></label>
    <label>El. paštas<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
    <label>Slaptažodis<input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <button className="button-dark">Sukurti paskyrą <span>↗</span></button>
    {msg&&<p className="form-message">{msg}</p>}
    <p>Jau turite paskyrą? <Link to="/login">Prisijungti</Link></p>
  </form></main>
}
