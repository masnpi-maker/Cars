import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';

export default function Navbar() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = session?.user.user_metadata?.name
    || session?.user.user_metadata?.full_name
    || session?.user.email?.split('@')[0]
    || 'Profilis';

  function openCatalog(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (location.pathname !== '/') navigate('/#cars');
    window.setTimeout(
      () => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }),
      location.pathname === '/' ? 0 : 120,
    );
  }

  return (
    <header className="nav-wrap">
      <nav className="nav">
        <Link to="/" className="brandmark">
          <span className="brand-icon">C</span>
          <span>CAR DESIGN<small>RATING</small></span>
        </Link>
        <div className="nav-links">
          {session && (
            <NavLink to="/profile" className="nav-login nav-profile" title="Mano profilis">
              {userName}
            </NavLink>
          )}
          <NavLink to="/#cars" onClick={openCatalog}>Automobiliai</NavLink>
          <NavLink to="/rankings">Reitingai</NavLink>
          {session ? (
            <button className="nav-login" onClick={() => supabase?.auth.signOut()}>
              Atsijungti
            </button>
          ) : (
            <Link className="nav-login" to="/login">Prisijungti <span>↗</span></Link>
          )}
        </div>
      </nav>
    </header>
  );
}
