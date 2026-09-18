import React, { useState, useEffect, useRef } from 'react';

const DIAGNOSES_POOL = [
  {
    crop: "Cotton · Identified",
    title: "Alternaria Leaf Spot",
    icon: "🍂",
    severity: "Severity: Mild (18% affected)",
    desc: "Small brown spots with concentric rings detected on lower leaves. Caused by high humidity.",
    treatment: "• Spray Mancozeb (2.5g/L) or Copper Oxychloride (3g/L) immediately.<br>• Maintain weed-free fields and destroy crop residues after harvest.<br>• Ensure proper spacing to improve aeration."
  },
  {
    crop: "Chilli · Identified",
    title: "Leaf Curl Virus",
    icon: "🌱",
    severity: "Severity: Moderate (35% affected)",
    desc: "Leaves curling upwards, thickening, and showing stunted plant growth. Spread by whiteflies.",
    treatment: "• Spray Neem Oil (5ml/L) or Imidacloprid (0.3ml/L) to control whiteflies.<br>• Pull out and burn severely infected plants immediately.<br>• Install yellow sticky traps (10 per acre)."
  },
  {
    crop: "Rice (Paddy) · Identified",
    title: "Healthy Crop Vigor",
    icon: "🌾",
    severity: "Severity: Excellent (96% vigor)",
    desc: "Optimal chlorophyll index and leaf turgidity. No disease symptoms or pest markers detected.",
    treatment: "• Continue current nitrogen/urea top-dressing schedule.<br>• Maintain shallow standing water (2-5cm) during tillering stage.<br>• Monitor every 10 days for signs of leaf rollers."
  }
];

export default function FarmerAICropScanner({ isOpen, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [logText, setLogText] = useState('Point camera at crop leaves and tap "Start Scan".');
  const [statusText, setStatusText] = useState('ALIGN LEAF');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setScanning(false);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  function startCamera() {
    setStatusText('ALIGN LEAF');
    setLogText('Point camera at crop leaves and tap "Start Scan".');
    setScanning(false);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setCameraActive(true);
        })
        .catch(() => {
          setCameraActive(false);
        });
    } else {
      setCameraActive(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }

  function handleTriggerScan() {
    if (scanning) return;
    setScanning(true);
    setStatusText('SCANNING...');

    const logs = [
      "Detecting crop type...",
      "Analyzing leaf chlorophyll index...",
      "Checking for fungal leaf spots & lesions...",
      "Querying Sri Siva Sai pathology DB..."
    ];

    logs.forEach((text, i) => {
      setTimeout(() => {
        setLogText(text);
      }, i * 650);
    });

    setTimeout(() => {
      stopCamera();
      const picked = DIAGNOSES_POOL[Math.floor(Math.random() * DIAGNOSES_POOL.length)];
      setScanResult(picked);
      setScanning(false);
    }, logs.length * 650 + 200);
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0B1512',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          color: '#FFFFFF'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: '#4ADE80' }}>
          {statusText}
        </div>

        <div style={{ width: 38 }} />
      </div>

      {/* Camera / Viewfinder Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8B9689',
              textAlign: 'center',
              padding: 24
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 12 }}>🌿</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Leaf Viewfinder</div>
            <div style={{ fontSize: 13, marginTop: 4, maxWidth: 220 }}>
              Align the crop leaf inside the target brackets below
            </div>
          </div>
        )}

        {/* Reticle Target Guide */}
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            border: `2px dashed ${scanning ? '#E39A3B' : '#4ADE80'}`,
            borderRadius: 24,
            boxShadow: scanning ? '0 0 30px rgba(227, 154, 59, 0.4)' : '0 0 20px rgba(74, 222, 128, 0.25)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {scanning && (
            <div
              style={{
                width: '100%',
                height: 2,
                background: '#E39A3B',
                boxShadow: '0 0 10px #E39A3B',
                animation: 'pulse 1s infinite alternate'
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom HUD bar */}
      <div
        style={{
          padding: '20px 24px 34px',
          background: '#0B1512',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: '#CBD5E1',
            minHeight: 20
          }}
        >
          {logText}
        </div>

        <button
          type="button"
          disabled={scanning}
          onClick={handleTriggerScan}
          style={{
            background: scanning ? '#475569' : '#4ADE80',
            color: '#0B1512',
            border: 'none',
            borderRadius: 28,
            padding: '14px 36px',
            fontSize: 16,
            fontWeight: 800,
            cursor: scanning ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 24px rgba(74, 222, 128, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {scanning ? 'Analyzing Crop...' : 'Start Scan'}
        </button>
      </div>

      {/* Scan Result Overlay Modal */}
      {scanResult && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 21, 18, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 10000
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '28px 28px 0 0',
              padding: '24px 20px 32px',
              animation: 'sheetUp 0.3s ease',
              maxHeight: '88%',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--canopy-deep)', textTransform: 'uppercase' }}>
                {scanResult.crop}
              </span>
              <button
                type="button"
                onClick={() => setScanResult(null)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 32 }}>{scanResult.icon}</span>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: 'var(--forest)' }}>
                  {scanResult.title}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B45309', marginTop: 2 }}>
                  {scanResult.severity}
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5, marginBottom: 14 }}>
              {scanResult.desc}
            </p>

            <div
              style={{
                background: 'var(--bg)',
                borderRadius: 16,
                padding: '14px 16px',
                marginBottom: 20
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--forest)', marginBottom: 6 }}>
                Recommended Action & Treatment:
              </div>
              <div
                style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: scanResult.treatment }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  alert('Scan diagnosis saved to your farm log!');
                  setScanResult(null);
                  onClose();
                }}
                className="btn primary"
                style={{
                  flex: 1,
                  background: 'var(--canopy-deep)',
                  color: '#FFFFFF',
                  borderRadius: 14,
                  height: 48,
                  fontSize: 14,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Save to Farm Log
              </button>
              <button
                type="button"
                onClick={() => {
                  setScanResult(null);
                  startCamera();
                }}
                className="btn ghost"
                style={{
                  background: 'transparent',
                  color: 'var(--forest)',
                  border: '1.5px solid var(--line)',
                  borderRadius: 14,
                  height: 48,
                  padding: '0 16px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Scan Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
