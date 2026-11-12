import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';

export default function Profile() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const user = session?.user;
  const name = user?.user_metadata?.name || user?.user_metadata?.full_name || 'Vartotojas';

  async function signOut() {
    await supabase?.auth.signOut();
    navigate('/');
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="eyebrow">VARTOTOJO PASKYRA</div>
        <h1>Mano profilis.</h1>
        <p><strong>Vardas</strong><br />{name}</p>
        <p><strong>El. paštas</strong><br />{user?.email}</p>
        <button className="button-dark" onClick={signOut}>Atsijungti <span>↗</span></button>
      </section>
    </main>
  );
}
