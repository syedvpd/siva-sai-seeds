import React, { useState, useEffect } from 'react';
import './farmerStyles.css';
import { supabase } from '../../lib/supabase';
import platformStorage from '../../platform/storage';
import { farmerService } from '../../services/farmerService';

import FarmerSplash from './FarmerSplash';
import FarmerLanguage from './FarmerLanguage';
import FarmerOnboarding from './FarmerOnboarding';
import FarmerLogin from './FarmerLogin';
import FarmerMobileLayout from './FarmerMobileLayout';

export default function FarmerApp() {
  const [currentFlow, setCurrentFlow] = useState('splash'); // 'splash' | 'lang' | 'onboard' | 'login' | 'app'
  const [lang, setLang] = useState('te'); // default regional: Telugu
  const [authUser, setAuthUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // 1. Initial Launch: Restore preferred language and check existing authenticated session
  useEffect(() => {
    async function initFarmerSession() {
      try {
        const savedLang = await platformStorage.getItem('prefLang');
        if (savedLang) {
          setLang(savedLang);
        }

        // Check if there is an active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          try {
            const profile = await farmerService.getProfile();
            if (profile) {
              setAuthUser(session.user);
              setFarmerProfile(profile);
              // Active session exists -> go to dashboard
              setCurrentFlow('app');
              setLoadingInitial(false);
              return;
            }
          } catch (_) {}
        }
      } catch (err) {
        console.warn('[FarmerApp] Init session error:', err);
      } finally {
        setLoadingInitial(false);
      }
    }

    initFarmerSession();
  }, []);

  function handleSelectLanguage(newLang) {
    setLang(newLang);
    platformStorage.setItem('prefLang', newLang);
  }

  function handleLoginSuccess(user, profile) {
    setAuthUser(user);
    setFarmerProfile(profile);
    setCurrentFlow('app');
  }

  function handleSkipLogin() {
    // Guest browse mode
    setAuthUser(null);
    setFarmerProfile(null);
    setCurrentFlow('app');
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      await platformStorage.removeItem('agro_token');
      await platformStorage.removeItem('agro_user');
    } catch (_) {}
    setAuthUser(null);
    setFarmerProfile(null);
    setCurrentFlow('splash');
  }

  if (loadingInitial) {
    return (
      <div
        className="farmer-app-root"
        style={{
          background: 'linear-gradient(180deg, #15302A 0%, #0F231E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: '#FFFFFF'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src="/image.png"
            alt="Sri Siva Sai Seeds"
            onError={(e) => { e.target.src = '/logo.jpeg'; }}
            style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid #FFFFFF', marginBottom: 16 }}
          />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700 }}>
            Sri Siva Sai Seeds
          </div>
          <div style={{ fontSize: 12, color: '#7BC79A', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
            Farmer Portal
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="farmer-app-root">
      <div className="device">
        <div className="screen-wrap">
          {/* Flow 1: Splash */}
          {currentFlow === 'splash' && (
            <FarmerSplash
              lang={lang}
              onGetStarted={() => setCurrentFlow('lang')}
            />
          )}

          {/* Flow 2: Language Selection */}
          {currentFlow === 'lang' && (
            <FarmerLanguage
              currentLang={lang}
              onSelectLanguage={handleSelectLanguage}
              onContinue={() => setCurrentFlow('onboard')}
            />
          )}

          {/* Flow 3: Onboarding Slides */}
          {currentFlow === 'onboard' && (
            <FarmerOnboarding
              lang={lang}
              onComplete={() => setCurrentFlow('login')}
            />
          )}

          {/* Flow 4: Login */}
          {currentFlow === 'login' && (
            <FarmerLogin
              lang={lang}
              onLoginSuccess={handleLoginSuccess}
              onSkip={handleSkipLogin}
            />
          )}

          {/* Flow 5: Main Application Dashboard */}
          {currentFlow === 'app' && (
            <FarmerMobileLayout
              lang={lang}
              onChangeLanguage={handleSelectLanguage}
              farmerProfile={farmerProfile}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
  );
}
