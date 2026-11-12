import {useState} from 'react';
import {useAuth} from '../hooks/useAuth';
import {supabase} from '../services/supabase';

export default function Profile(){
  const {session}=useAuth();
  const user=session?.user;
  const metadata=user?.user_metadata||{};
  const username=String(metadata.username||metadata.full_name||metadata.name||metadata.display_name||'');
  const [newUsername,setNewUsername]=useState('');
  const [message,setMessage]=useState('');

  async function saveUsername(e:React.FormEvent){
    e.preventDefault();
    const value=newUsername.trim();
    if(!value||!supabase)return;
    const {error}=await supabase.auth.updateUser({data:{...user?.user_metadata,username:value,name:value}});
    setMessage(error?error.message:'Vartotojo vardas išsaugotas.');
  }

  return <main className="section-wrap profile-page">
    <div className="eyebrow">JŪSŲ PASKYRA</div>
    <h1>Vartotojo <em>profilis.</em></h1>
    <section className="profile-card" aria-label="Vartotojo informacija">
      <div className="profile-avatar">{(username||'?').charAt(0).toUpperCase()}</div>
      <div className="profile-details">
        <h2>{username||'Vardas nenustatytas'}</h2>
        <p><span>El. paštas</span>{user?.email}</p>
      </div>
    </section>
    {!username&&<form className="profile-name-form" onSubmit={saveUsername}>
      <label>Vartotojo vardas<input required minLength={2} maxLength={30} value={newUsername} onChange={e=>setNewUsername(e.target.value)}/></label>
      <button className="button-dark">Išsaugoti vardą <span>↗</span></button>
      {message&&<p className="form-message">{message}</p>}
    </form>}
  </main>
}
