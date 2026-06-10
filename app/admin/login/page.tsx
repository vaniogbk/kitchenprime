'use client';
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await signIn('credentials', { email, password, redirect: false });
    setSubmitting(false);
    if (res?.error) setError('Identifiants invalides');
    else router.push('/admin/dashboard');
  }

  return (
    <div style={{
      maxWidth: 420, margin: '60px auto',
      background: '#fff', border: '1px solid var(--line)',
      borderRadius: 14, padding: 28,
    }}>
      <div className="logo" style={{ marginBottom: 6 }}>Kitchen<span>Prime</span></div>
      <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 22 }}>Administration · Espace privé</div>
      <form onSubmit={onSubmit}>
        <div className="fg ffull" style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="fg ffull" style={{ marginBottom: 12 }}>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'var(--copper-dark)', fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <button type="submit" disabled={submitting} className="btn-buy" style={{ width: '100%', padding: 13, opacity: submitting ? 0.6 : 1 }}>
          <i className="fa-solid fa-lock" /> {submitting ? '…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
