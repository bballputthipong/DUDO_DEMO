'use client';

import { LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAuthStore } from '@/lib/auth-store';

export default function PartnerLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mock login — replace with real API call when backend is ready
      // const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // const res = await fetch(`${API_BASE}/auth/login`, { ... });

      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockToken = 'mock-partner-token';
      const mockPartner = { id: 'p1', businessName: 'Demo Partner' };

      document.cookie = `partner_auth_token=${mockToken}; path=/; max-age=86400`;
      setAuth(mockToken, mockPartner);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <ShieldCheck size={32} />
          </div>
          <h1>Wellness Partner</h1>
          <p>Manage your wellness business<br />from one place</p>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <span className="login-feature-num">01</span>
            <span>Manage bookings and check-ins</span>
          </div>
          <div className="login-feature">
            <span className="login-feature-num">02</span>
            <span>Create and manage classes</span>
          </div>
          <div className="login-feature">
            <span className="login-feature-num">03</span>
            <span>View revenue reports and settlements</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Partner Dashboard</p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              className="form-input"
              id="login-email"
              type="email"
              placeholder="partner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>

          <p className="login-help">
            Want to create a partner account?{' '}
            <a href="mailto:support@wellness.app">Contact Us</a>
          </p>
        </form>
      </div>

      <style jsx>{`
        .login-page {
          display: flex;
          min-height: 100vh;
        }

        .login-left {
          flex: 1;
          background: linear-gradient(135deg, var(--color-navy-900) 0%, var(--color-navy-700) 100%);
          color: var(--text-inverse);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--space-12);
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
        }

        .login-left::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -50px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(232, 147, 15, 0.08);
        }

        .login-brand {
          position: relative;
          z-index: 1;
          margin-bottom: var(--space-10);
        }

        .login-brand-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-5);
        }

        .login-brand h1 {
          font-size: var(--font-size-3xl);
          color: var(--text-inverse);
          margin: 0 0 var(--space-2) 0;
          letter-spacing: var(--letter-spacing-tight);
        }

        .login-brand p {
          font-size: var(--font-size-md);
          opacity: 0.7;
          line-height: var(--line-height-snug);
          margin: 0;
        }

        .login-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          position: relative;
          z-index: 1;
        }

        .login-feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--font-size-base);
          opacity: 0.85;
        }

        .login-feature-num {
          font-size: var(--font-size-2xs);
          font-weight: var(--font-weight-bold);
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: var(--letter-spacing-wider);
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          background: var(--bg-base);
        }

        .login-form {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .login-form-header {
          margin-bottom: var(--space-2);
        }

        .login-form-header h2 {
          font-size: var(--font-size-2xl);
          margin: 0 0 var(--space-1) 0;
        }

        .login-form-header p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .login-error {
          background: #fee2e2;
          color: #991b1b;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
        }

        .password-toggle {
          position: absolute;
          right: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-1);
          display: flex;
          align-items: center;
        }

        .login-btn {
          width: 100%;
          padding: var(--space-3) var(--space-5);
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          transition: background var(--duration-fast) var(--ease-standard),
                      transform var(--duration-instant) var(--ease-standard);
        }

        .login-btn:hover:not(:disabled) {
          background: var(--action-primary-bg-hover);
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.96);
        }

        .login-btn:disabled {
          background: var(--action-disabled-bg);
          color: var(--action-disabled-text);
          cursor: not-allowed;
        }

        .login-help {
          text-align: center;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
        }

        .login-help a {
          color: var(--text-brand);
          font-weight: var(--font-weight-medium);
        }

        @media (max-width: 768px) {
          .login-page {
            flex-direction: column;
          }
          .login-left {
            padding: var(--space-8) var(--space-5);
            min-height: auto;
          }
          .login-features {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
