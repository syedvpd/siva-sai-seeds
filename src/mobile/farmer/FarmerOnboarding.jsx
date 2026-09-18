import React, { useState } from 'react';
import { getTranslation } from './farmerI18n';

export default function FarmerOnboarding({ lang, onComplete }) {
  const [slideIndex, setSlideIndex] = useState(1);
  const totalSlides = 4;

  const slides = [
    {
      id: 1,
      image: '/assets/crops/onb_track_crop_1784644792435.png',
      titleKey: 'ob1Title',
      descKey: 'ob1Desc'
    },
    {
      id: 2,
      image: '/assets/crops/onb_weather_water_1784644824818.png',
      titleKey: 'ob2Title',
      descKey: 'ob2Desc'
    },
    {
      id: 3,
      image: '/assets/crops/onb_mandi_prices_1784644862143.png',
      titleKey: 'ob3Title',
      descKey: 'ob3Desc'
    },
    {
      id: 4,
      image: '/assets/crops/onb_farmer_help_1784644890148.png',
      titleKey: 'ob4Title',
      descKey: 'ob4Desc'
    }
  ];

  const currentSlide = slides[slideIndex - 1];

  function handleNext() {
    if (slideIndex < totalSlides) {
      setSlideIndex(slideIndex + 1);
    } else {
      onComplete();
    }
  }

  return (
    <div
      id="flow-onboard"
      className="flow active"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100%',
        padding: '20px 24px',
        background: 'var(--bg)',
        position: 'relative'
      }}
    >
      {/* Top bar with Skip button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
        <button
          type="button"
          onClick={onComplete}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: "'Manrope', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px 12px'
          }}
        >
          {getTranslation(lang, 'skip')}
        </button>
      </div>

      {/* Slide Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '10px 0'
        }}
      >
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: '#E9F0DD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            boxShadow: '0 12px 28px rgba(21, 48, 42, 0.08)',
            overflow: 'hidden'
          }}
        >
          <img
            src={currentSlide.image}
            alt={getTranslation(lang, currentSlide.titleKey)}
            onError={(e) => { e.target.src = '/image.png'; }}
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain'
            }}
          />
        </div>

        <div
          className="display"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--forest)',
            maxWidth: 300,
            lineHeight: 1.25
          }}
        >
          {getTranslation(lang, currentSlide.titleKey)}
        </div>

        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 14.5,
            fontWeight: 500,
            color: 'var(--text-muted)',
            maxWidth: 290,
            lineHeight: 1.5,
            marginTop: 12
          }}
        >
          {getTranslation(lang, currentSlide.descKey)}
        </p>
      </div>

      {/* Bottom controls: Dots & Next */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          paddingBottom: 16
        }}
      >
        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {slides.map((s) => {
            const isActive = s.id === slideIndex;
            return (
              <div
                key={s.id}
                onClick={() => setSlideIndex(s.id)}
                style={{
                  width: isActive ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: isActive ? 'var(--canopy-deep)' : 'var(--line)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
              />
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleNext}
          style={{
            background: slideIndex === totalSlides ? '#F2A63A' : 'var(--canopy-deep)',
            color: slideIndex === totalSlides ? '#2D1F0A' : '#FFFFFF',
            border: 'none',
            borderRadius: 24,
            padding: '12px 28px',
            fontFamily: "'Manrope', sans-serif",
            fontSize: 14.5,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(21, 48, 42, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {slideIndex === totalSlides
            ? getTranslation(lang, 'getStarted')
            : getTranslation(lang, 'next')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
