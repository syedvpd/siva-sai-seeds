import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, getTranslation } from './farmerI18n';
import FarmerHome from './FarmerHome';
import FarmerFields from './FarmerFields';
import FarmerSeeds from './FarmerSeeds';
import FarmerGrainSales from './FarmerGrainSales';
import FarmerAccount from './FarmerAccount';
import FarmerAICropScanner from './FarmerAICropScanner';
import FarmerInvoiceModal from './FarmerInvoiceModal';

export default function FarmerMobileLayout({
  lang,
  onChangeLanguage,
  farmerProfile,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'crops' | 'seeds' | 'market' | 'account'
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState(true);

  return (
    <div
      id="flow-app"
      className="flow active"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100%',
        background: 'var(--bg)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* 1. Top Navbar */}
      <div
        className="app-navbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--line)',
          flexShrink: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'var(--forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <img
              src="/image.png"
              alt="Brand logo"
              onError={(e) => { e.target.src = '/logo.jpeg'; }}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: 'var(--forest)', lineHeight: 1.1 }}>
              {getTranslation(lang, 'brandName')}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--canopy-deep)' }}>
              FARMER PORTAL
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Quick Language Switch Button */}
          <button
            type="button"
            onClick={() => setShowLanguageModal(true)}
            style={{
              height: 36,
              padding: '0 10px',
              borderRadius: 12,
              background: 'var(--surface-alt)',
              border: '1px solid var(--line)',
              color: 'var(--canopy-deep)',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>🌐</span>
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => {
              setUnreadNotif(false);
              alert('Notifications: No pending pest advisories for your region today.');
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadNotif && (
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--alert)',
                  border: '1.5px solid #FFFFFF'
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* 2. Scrollable Content Body */}
      <div
        id="content"
        className="content"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 18px 24px',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {activeTab === 'home' && (
          <FarmerHome
            farmerProfile={farmerProfile}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenInvoice={(inv) => setCurrentInvoice(inv)}
          />
        )}

        {activeTab === 'crops' && (
          <FarmerFields
            farmerProfile={farmerProfile}
          />
        )}

        {activeTab === 'seeds' && (
          <FarmerSeeds
            onOpenInvoice={(inv) => setCurrentInvoice(inv)}
          />
        )}

        {activeTab === 'market' && (
          <FarmerGrainSales
            onOpenInvoice={(inv) => setCurrentInvoice(inv)}
          />
        )}

        {activeTab === 'account' && (
          <FarmerAccount
            farmerProfile={farmerProfile}
            onOpenLanguageModal={() => setShowLanguageModal(true)}
            onLogout={onLogout}
          />
        )}
      </div>

      {/* 3. Bottom 5-Tab Navigation Bar */}
      <div
        className="tabbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '10px 10px calc(14px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(14px)',
          borderTop: '1px solid var(--line)',
          flexShrink: 0,
          zIndex: 40
        }}
      >
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`tab ${activeTab === 'home' ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            padding: '4px 10px',
            color: activeTab === 'home' ? 'var(--canopy-deep)' : 'var(--text-faint)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span style={{ fontSize: 10.5, fontWeight: 800 }}>
            {getTranslation(lang, 'navHome')}
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--canopy)',
              opacity: activeTab === 'home' ? 1 : 0
            }}
          />
        </button>

        {/* Tab 2: Crops / Fields */}
        <button
          type="button"
          onClick={() => setActiveTab('crops')}
          className={`tab ${activeTab === 'crops' ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            padding: '4px 10px',
            color: activeTab === 'crops' ? 'var(--canopy-deep)' : 'var(--text-faint)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span style={{ fontSize: 10.5, fontWeight: 800 }}>
            {getTranslation(lang, 'navCrops')}
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--canopy)',
              opacity: activeTab === 'crops' ? 1 : 0
            }}
          />
        </button>

        {/* Tab 3: Seeds */}
        <button
          type="button"
          onClick={() => setActiveTab('seeds')}
          className={`tab ${activeTab === 'seeds' ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            padding: '4px 10px',
            color: activeTab === 'seeds' ? 'var(--canopy-deep)' : 'var(--text-faint)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span style={{ fontSize: 10.5, fontWeight: 800 }}>
            Seeds
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--canopy)',
              opacity: activeTab === 'seeds' ? 1 : 0
            }}
          />
        </button>

        {/* Tab 4: Market / Grain Sales */}
        <button
          type="button"
          onClick={() => setActiveTab('market')}
          className={`tab ${activeTab === 'market' ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            padding: '4px 10px',
            color: activeTab === 'market' ? 'var(--canopy-deep)' : 'var(--text-faint)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span style={{ fontSize: 10.5, fontWeight: 800 }}>
            {getTranslation(lang, 'navMarket')}
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--canopy)',
              opacity: activeTab === 'market' ? 1 : 0
            }}
          />
        </button>

        {/* Tab 5: Account */}
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`tab ${activeTab === 'account' ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            padding: '4px 10px',
            color: activeTab === 'account' ? 'var(--canopy-deep)' : 'var(--text-faint)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span style={{ fontSize: 10.5, fontWeight: 800 }}>
            {getTranslation(lang, 'navAccount')}
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--canopy)',
              opacity: activeTab === 'account' ? 1 : 0
            }}
          />
        </button>
      </div>

      {/* 4. Overlays & Modals */}
      <FarmerAICropScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <FarmerInvoiceModal
        invoice={currentInvoice}
        onClose={() => setCurrentInvoice(null)}
      />

      {/* Language Switch Modal */}
      {showLanguageModal && (
        <div
          id="modal-language"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(21, 48, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 9999
          }}
          onClick={(e) => { if (e.target.id === 'modal-language') setShowLanguageModal(false); }}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '26px 26px 0 0',
              padding: '24px 20px 32px',
              animation: 'sheetUp 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: 'var(--forest)' }}>
                Select Language
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SUPPORTED_LANGUAGES.map((l) => (
                <div
                  key={l.code}
                  onClick={() => {
                    onChangeLanguage(l.code);
                    setShowLanguageModal(false);
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: lang === l.code ? 'var(--surface-alt)' : '#FFFFFF',
                    border: `1.5px solid ${lang === l.code ? 'var(--canopy-deep)' : 'var(--line)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>{l.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l.sub}</span>
                  </div>
                  {lang === l.code && (
                    <span style={{ color: 'var(--canopy-deep)', fontWeight: 800 }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
