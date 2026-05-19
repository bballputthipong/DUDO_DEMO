'use client';

import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function CorporateLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock login — replace with real API call
    setTimeout(() => {
      document.cookie = `corporate_auth_token=mock-token; path=/; max-age=86400`;
      localStorage.setItem('corporate_auth_token', 'mock-token');
      router.push('/');
    }, 800);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, background: 'white', borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--space-8) var(--space-8) var(--space-6)',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          textAlign: 'center', color: 'white',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-4)',
          }}>
            <Building2 size={28} />
          </div>
          <h1 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--font-size-xl)' }}>Corporate Portal</h1>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', opacity: 0.6 }}>
            Corporate Wellness Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-6) var(--space-8) var(--space-8)' }}>
          <div className="form-field" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label" htmlFor="login-email">Corporate Email</label>
            <input id="login-email" className="form-input" type="email" placeholder="hr@company.co.th"
              value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="form-field" style={{ marginBottom: 'var(--space-6)' }}>
            <label className="form-label" htmlFor="login-password">Password</label>
            <input id="login-password" className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 'var(--space-3)', border: 'none',
            borderRadius: 'var(--radius-md)', background: 'var(--action-primary-bg)',
            color: 'var(--action-primary-text)', fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)', cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
