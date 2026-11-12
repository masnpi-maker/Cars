import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMsg('Supabase nėra sukonfigūruotas.');
      return;
    }

    setSubmitting(true);
    setMsg('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    });
    setSubmitting(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    if (data.session) {
      navigate('/');
      return;
    }

    setMsg('Paskyra sukurta. Prisijunkite naudodami el. paštą ir slaptažodį.');
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="eyebrow">TAPTI BENDRUOMENĖS DALIMI</div>
        <h1>Registruotis.</h1>
        <label>
          Vardas
          <input
            type="text"
            required
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          El. paštas
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Slaptažodis
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="button-dark" disabled={submitting}>
          {submitting ? 'Kuriama paskyra…' : 'Sukurti paskyrą'} <span>↗</span>
        </button>
        {msg && <p className="form-message">{msg}</p>}
        <p>
          Jau turite paskyrą? <Link to="/login">Prisijungti</Link>
        </p>
      </form>
    </main>
  );
}
