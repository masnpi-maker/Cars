import {Link,NavLink,useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {supabase} from '../services/supabase';

export default function Navbar(){
  const {session}=useAuth();
  const navigate=useNavigate();
  const location=useLocation();
  const metadata=session?.user.user_metadata||{};
  const username=String(metadata.username||metadata.full_name||metadata.name||metadata.display_name||'Nustatyti vardą');

  function openCatalog(e:React.MouseEvent){
    e.preventDefault();
    if(location.pathname!=='/')navigate('/#cars');
    window.setTimeout(()=>document.getElementById('cars')?.scrollIntoView({behavior:'smooth'}),location.pathname==='/'?0:120);
  }

  return <header className="nav-wrap"><nav className="nav">
    <Link to="/" className="brandmark"><span className="brand-icon">C</span><span>CAR DESIGN<small>RATING</small></span></Link>
    <div className="nav-links">
      {session&&<Link className="nav-user" to="/profile">{username}</Link>}
      <NavLink to="/#cars" onClick={openCatalog}>Automobiliai</NavLink>
      <NavLink to="/rankings">Reitingai</NavLink>
      {session
        ? <button className="nav-login" onClick={()=>supabase?.auth.signOut()}>Atsijungti</button>
        : <Link className="nav-login" to="/login">Prisijungti <span>↗</span></Link>}
    </div>
  </nav></header>
}
