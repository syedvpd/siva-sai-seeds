import React from 'react';
import { SUPPORTED_LANGUAGES, getTranslation } from './farmerI18n';

export default function FarmerLanguage({ currentLang, onSelectLanguage, onContinue }) {
  return (
    <div
      id="flow-lang"
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
      <div style={{ marginTop: 12, marginBottom: 20 }}>
        <div
          className="display"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--forest)',
            lineHeight: 1.2
          }}
        >
          {getTranslation(currentLang, 'selectLanguage')}
        </div>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            marginTop: 6,
            lineHeight: 1.4
          }}
        >
          {getTranslation(currentLang, 'selectLanguageSub')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {SUPPORTED_LANGUAGES.map((langItem) => {
          const isSelected = currentLang === langItem.code;
          return (
            <div
              key={langItem.code}
              className={`card lang-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectLanguage(langItem.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderRadius: 18,
                background: isSelected ? 'var(--surface-alt)' : 'var(--surface)',
                border: `2px solid ${isSelected ? 'var(--canopy-deep)' : 'var(--line)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: isSelected ? 'var(--canopy-deep)' : '#F0F5EC',
                    color: isSelected ? '#FFFFFF' : 'var(--canopy-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 700
                  }}
                >
                  {langItem.code.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
                    {langItem.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {langItem.sub}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {langItem.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: isSelected ? 'var(--canopy-deep)' : 'var(--text-muted)',
                      background: isSelected ? '#DFF0DF' : 'var(--surface-alt)',
                      padding: '3px 8px',
                      borderRadius: 100
                    }}
                  >
                    {langItem.badge}
                  </span>
                )}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--canopy-deep)' : '#CBD5E1'}`,
                    background: isSelected ? 'var(--canopy-deep)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, paddingBottom: 12 }}>
        <button
          id="lang-continue"
          type="button"
          className="btn primary block"
          onClick={onContinue}
          style={{
            background: 'var(--canopy-deep)',
            color: '#FFFFFF',
            borderRadius: 18,
            height: 52,
            fontSize: 15,
            fontWeight: 800,
            border: 'none',
            boxShadow: '0 8px 20px rgba(31, 92, 66, 0.3)',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          {getTranslation(currentLang, 'continueBtn')}
        </button>
      </div>
    </div>
  );
}
