import React from 'react';
import { getTranslation } from './farmerI18n';

export default function FarmerSplash({ lang, onGetStarted }) {
  return (
    <div
      id="flow-splash"
      className="flow active"
      onClick={onGetStarted}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '100%',
        padding: '32px 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #15302A 0%, #0F231E 100%)',
        color: '#FFFFFF',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div className="splash-logo" style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
        <img
          src="/image.png"
          alt="Sri Siva Sai Seeds logo"
          onError={(e) => { e.target.src = '/logo.jpeg'; }}
          style={{
            width: 170,
            height: 170,
            objectFit: 'contain',
            background: '#FFFFFF',
            borderRadius: '50%',
            border: '6px solid #FFFFFF',
            boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
            display: 'block'
          }}
        />
      </div>

      <div>
        <div
          className="display"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 32,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.5px'
          }}
        >
          {getTranslation(lang, 'brandName')}
        </div>
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#7BC79A',
            marginTop: 10
          }}
        >
          {getTranslation(lang, 'brandSub')}
        </div>
      </div>

      <p
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 16,
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.82)',
          maxWidth: 290,
          lineHeight: 1.5,
          marginTop: 28
        }}
      >
        {getTranslation(lang, 'splashTag')}
      </p>

      <button
        type="button"
        className="btn block"
        onClick={(e) => {
          e.stopPropagation();
          onGetStarted();
        }}
        style={{
          background: '#F2A63A',
          color: '#2D1F0A',
          borderRadius: 28,
          height: 54,
          padding: '0 32px',
          fontWeight: 800,
          fontSize: 16,
          border: 'none',
          width: '100%',
          maxWidth: 290,
          marginTop: 38,
          boxShadow: '0 10px 22px rgba(242, 166, 58, 0.35)',
          cursor: 'pointer'
        }}
      >
        {getTranslation(lang, 'getStarted')}
      </button>

      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginTop: 24
        }}
      >
        {getTranslation(lang, 'tapHint')}
      </div>
    </div>
  );
}
