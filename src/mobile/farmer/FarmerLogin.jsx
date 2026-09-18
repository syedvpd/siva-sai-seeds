import React, { useState } from 'react';
import { getTranslation } from './farmerI18n';
import { authService } from '../../services/authService';

export default function FarmerLogin({ lang, onLoginSuccess, onSkip }) {
  const [view, setView] = useState('choice'); // 'choice' | 'form' | 'new'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin(e) {
    if (e) e.preventDefault();
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setErrorMsg('Please enter your mobile number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = await authService.login(cleanPhone, password);
      if (result && result.user) {
        if (result.user.role && result.user.role !== 'farmer') {
          throw new Error('This app is exclusively for Farmers. Please use the Admin Console app.');
        }
        onLoginSuccess(result.user, result.profile);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  // 1. Choice View
  if (view === 'choice') {
    return (
      <div
        id="flow-login"
        className="flow active"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: '100%',
          padding: '24px 20px',
          background: 'var(--bg)',
          overflowY: 'auto'
        }}
      >
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <div
            className="display"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--forest)'
            }}
          >
            {getTranslation(lang, 'loginTitle')}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
            {getTranslation(lang, 'loginSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {/* Card A: Already have credentials */}
          <div
            className="card"
            style={{
              padding: '20px 18px',
              borderRadius: 20,
              background: '#FFFFFF',
              border: '1.5px solid var(--line)',
              boxShadow: '0 8px 20px rgba(21, 48, 42, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'var(--surface-alt)',
                  color: 'var(--canopy-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
                  {getTranslation(lang, 'cardATitle')}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  {getTranslation(lang, 'cardADesc')}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn primary block"
              onClick={() => setView('form')}
              style={{
                marginTop: 18,
                background: 'var(--canopy-deep)',
                color: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 18px',
                fontSize: 14.5,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {getTranslation(lang, 'signInNow')}
            </button>
          </div>

          {/* Card B: New to Sri Siva Sai Seeds */}
          <div
            className="card"
            style={{
              padding: '20px 18px',
              borderRadius: 20,
              background: '#FFFFFF',
              border: '1.5px solid var(--line)',
              boxShadow: '0 8px 20px rgba(21, 48, 42, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'var(--amber-soft)',
                  color: '#8A5C15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
                  {getTranslation(lang, 'cardBTitle')}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  {getTranslation(lang, 'cardBDesc')}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn ghost block"
              onClick={() => setView('new')}
              style={{
                marginTop: 18,
                background: 'transparent',
                color: 'var(--forest)',
                border: '1.5px solid var(--line)',
                borderRadius: 14,
                padding: '12px 18px',
                fontSize: 14.5,
                fontWeight: 800,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {getTranslation(lang, 'useCredentials')}
            </button>
          </div>
        </div>

        {/* Skip action */}
        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 16 }}>
          <button
            type="button"
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {getTranslation(lang, 'skipForNow')}
          </button>
        </div>
      </div>
    );
  }

  // 2. Form View
  if (view === 'form') {
    return (
      <div
        id="login-form"
        className="login-view active"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: '100%',
          padding: '24px 20px',
          background: 'var(--bg)',
          overflowY: 'auto'
        }}
      >
        <button
          type="button"
          onClick={() => { setErrorMsg(''); setView('choice'); }}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--forest)',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
            marginBottom: 20
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div style={{ marginBottom: 24 }}>
          <div
            className="display"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--forest)'
            }}
          >
            {getTranslation(lang, 'welcomeBack')}
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>
            {getTranslation(lang, 'loginFormSub')}
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: '#FEE2E2',
              color: '#991B1B',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              lineHeight: 1.4
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
              {getTranslation(lang, 'mobileLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--text-muted)'
                }}
              >
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                maxLength={12}
                disabled={loading}
                style={{
                  width: '100%',
                  height: 52,
                  paddingLeft: 52,
                  paddingRight: 14,
                  borderRadius: 14,
                  border: '1.5px solid var(--line)',
                  background: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
              {getTranslation(lang, 'passwordLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
                style={{
                  width: '100%',
                  height: 52,
                  paddingLeft: 14,
                  paddingRight: 44,
                  borderRadius: 14,
                  border: '1.5px solid var(--line)',
                  background: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: -4 }}>
            <button
              type="button"
              onClick={() => setView('new')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--canopy-deep)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {getTranslation(lang, 'forgotPassword')}
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              type="submit"
              disabled={loading}
              className="btn primary block"
              style={{
                background: 'var(--canopy-deep)',
                color: '#FFFFFF',
                borderRadius: 16,
                height: 52,
                fontSize: 16,
                fontWeight: 800,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 8px 20px rgba(31, 92, 66, 0.3)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? 'Authenticating...' : getTranslation(lang, 'loginBtn')}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 16 }}>
          <button
            type="button"
            onClick={() => setView('new')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {getTranslation(lang, 'cardBTitle')} <span style={{ color: 'var(--canopy-deep)' }}>{getTranslation(lang, 'useCredentials')}</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. New Registration / Contact View
  return (
    <div
      id="login-new"
      className="login-view active"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100%',
        padding: '24px 20px',
        background: 'var(--bg)',
        overflowY: 'auto'
      }}
    >
      <button
        type="button"
        onClick={() => setView('choice')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--forest)',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          padding: 0,
          marginBottom: 20
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div style={{ marginBottom: 24 }}>
        <div
          className="display"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--forest)'
          }}
        >
          {getTranslation(lang, 'contactTeamTitle')}
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
          {getTranslation(lang, 'contactTeamDesc')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <a
          href="tel:+919440123456"
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '18px',
            borderRadius: 18,
            background: '#FFFFFF',
            border: '1.5px solid var(--line)',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'var(--surface-alt)',
              color: 'var(--canopy-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
              {getTranslation(lang, 'callUs')}
            </div>
            <div style={{ fontSize: 13, color: 'var(--canopy-deep)', fontWeight: 700, marginTop: 2 }}>
              +91 94401 23456
            </div>
          </div>
        </a>

        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            padding: '18px',
            borderRadius: 18,
            background: '#FFFFFF',
            border: '1.5px solid var(--line)'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'var(--amber-soft)',
              color: '#8A5C15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
              {getTranslation(lang, 'visitUs')}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
              {getTranslation(lang, 'visitAddress')}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, paddingBottom: 16 }}>
        <button
          type="button"
          onClick={() => setView('form')}
          className="btn primary block"
          style={{
            background: 'var(--canopy-deep)',
            color: '#FFFFFF',
            borderRadius: 16,
            height: 52,
            fontSize: 15,
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          {getTranslation(lang, 'signInNow')}
        </button>
      </div>
    </div>
  );
}
