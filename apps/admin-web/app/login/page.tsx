'use client';

import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock login — replace with real API call
    setTimeout(() => {
      document.cookie = `admin_auth_token=mock-token; path=/; max-age=86400`;
      localStorage.setItem('admin_auth_token', 'mock-token');
      router.push('/');
    }, 800);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f0f12',
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: '#1a1a1f', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '40px 32px 24px', textAlign: 'center', color: 'white',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: '#dc2626', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Shield size={26} />
          </div>
          <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>Admin Console</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Restricted Access — Authorized Personnel Only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 32px 32px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Email
            </label>
            <input type="email" placeholder="admin@wellness.th" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus
              style={{
                width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              style={{
                width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 12, border: 'none', borderRadius: 8,
            background: '#dc2626', color: 'white', fontSize: 14, fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
