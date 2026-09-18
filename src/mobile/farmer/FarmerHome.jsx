import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';

export default function FarmerHome({ farmerProfile, onNavigateTab, onOpenScanner, onOpenInvoice }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const data = await farmerService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('[FarmerHome] Failed to load dashboard:', err.message);
      setError('Unable to load real farm metrics. Please check connection.');
    } finally {
      setLoading(false);
    }
  }

  const farmerName = farmerProfile?.name || 'Farmer';
  const locationText = farmerProfile?.village 
    ? `${farmerProfile.village}, ${farmerProfile.district || 'Kurnool'}`
    : 'Kalluru, Kurnool (AP)';

  return (
    <div id="screen-home" className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Greeting & Farm Summary */}
      <div style={{ padding: '4px 2px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--canopy-deep)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Kurnool Zone
            </div>
            <div
              className="display"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--forest)',
                marginTop: 2
              }}
            >
              Namaste, {farmerName}
            </div>
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              background: 'var(--surface-alt)',
              color: 'var(--canopy-deep)',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {locationText}
          </div>
        </div>

        {/* Real Farm Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginTop: 14
          }}
        >
          <div
            className="card"
            style={{
              padding: '12px 10px',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid var(--line)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>Active Crops</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--forest)', marginTop: 2 }}>
              {loading ? '...' : (dashboardData?.activeCropsCount ?? 0)}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '12px 10px',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid var(--line)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>Total Acres</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--forest)', marginTop: 2 }}>
              {loading ? '...' : (dashboardData?.totalAcres ?? farmerProfile?.acres_of_land ?? 0)}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '12px 10px',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid var(--line)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>Pending Slots</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--canopy-deep)', marginTop: 2 }}>
              {loading ? '...' : (dashboardData?.pendingBookings ?? 0)}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 12.5, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* 2. Weather & Soil Moisture Card */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, #1F4438 0%, #15302A 100%)',
          color: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(21, 48, 42, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#7BC79A' }}>
              Weather & Soil Advisory
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>31°C</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Partly Sunny · Rain 10%</span>
            </div>
          </div>
          <div style={{ fontSize: 36 }}>⛅</div>
        </div>

        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              Soil Moisture: <strong>62% (Optimal)</strong>
            </span>
          </div>
          <span style={{ fontSize: 11.5, color: '#A7F3D0', fontWeight: 700 }}>No Irrigation Needed</span>
        </div>
      </div>

      {/* 3. AI Crop Health Scanner CTA Card */}
      <div
        className="card"
        onClick={onOpenScanner}
        style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, #F6E2BE 0%, #E9F0DD 100%)',
          border: '1.5px solid #E1E8D8',
          borderRadius: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 6px 18px rgba(227, 154, 59, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            📸
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#15302A' }}>
              AI Crop Leaf Scanner
            </div>
            <div style={{ fontSize: 12, color: '#657268', marginTop: 2 }}>
              Instant pest & pathology disease diagnosis
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            background: 'var(--canopy-deep)',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 800
          }}
        >
          Scan
        </div>
      </div>

      {/* 4. Quick Action Tiles Grid */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--forest)', marginBottom: 10, letterSpacing: 0.5 }}>
          QUICK ACTIONS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <div
            className="card"
            onClick={() => onNavigateTab('seeds')}
            style={{
              padding: '14px 16px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div style={{ fontSize: 22 }}>🌱</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Buy Seeds</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Certified stock</div>
            </div>
          </div>

          <div
            className="card"
            onClick={() => onNavigateTab('market')}
            style={{
              padding: '14px 16px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div style={{ fontSize: 22 }}>🏭</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Book Slot</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Warehouse drop</div>
            </div>
          </div>

          <div
            className="card"
            onClick={() => onNavigateTab('crops')}
            style={{
              padding: '14px 16px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div style={{ fontSize: 22 }}>🌾</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>My Fields</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Crop cycles</div>
            </div>
          </div>

          <div
            className="card"
            onClick={() => onNavigateTab('market')}
            style={{
              padding: '14px 16px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div style={{ fontSize: 22 }}>📈</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Mandi Rates</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Daily APMC</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity / Orders (Strictly from real DB) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--forest)', letterSpacing: 0.5 }}>
            RECENT ORDERS & BOOKINGS
          </div>
          <button
            type="button"
            onClick={loadDashboard}
            style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: 'var(--canopy-deep)', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Loading real orders...
          </div>
        ) : (!dashboardData?.purchases?.length && !dashboardData?.upcomingDeliveries?.length) ? (
          <div
            className="card"
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px dashed var(--line)'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>📦</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>No orders yet</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Your seed purchases and warehouse slots will appear here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dashboardData?.purchases?.slice(0, 3).map((p) => (
              <div
                key={`pur-${p.id}`}
                className="card"
                onClick={() => onOpenInvoice({
                  title: `${p.seeds?.name || 'Certified Seed'} Purchase`,
                  orderId: `ORD-${p.id}`,
                  date: new Date(p.created_at).toLocaleDateString('en-IN'),
                  status: p.status === 'delivered' ? 'Delivered' : 'Pending',
                  color: p.status === 'delivered' ? '#28653F' : '#B45309',
                  details: `${p.quantity_kg} kg`,
                  total: `₹${p.total_price?.toLocaleString('en-IN')}`
                })}
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: '#FFFFFF',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: '#F0F8EC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    🌱
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>
                      {p.seeds?.name || 'Seed Order'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      #{p.id} · {p.quantity_kg} kg · ₹{p.total_price}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: p.status === 'delivered' ? '#28653F' : '#B45309',
                    background: p.status === 'delivered' ? '#E7F4EB' : '#FEF3C7',
                    padding: '4px 8px',
                    borderRadius: 8
                  }}
                >
                  {p.status || 'Pending'}
                </span>
              </div>
            ))}

            {dashboardData?.upcomingDeliveries?.slice(0, 3).map((b) => (
              <div
                key={`book-${b.id}`}
                className="card"
                onClick={() => onOpenInvoice({
                  title: `Warehouse Slot (${b.grain_type})`,
                  orderId: `SLOT-${b.id}`,
                  date: b.booking_date,
                  status: b.status === 'confirmed' ? 'Confirmed' : 'Pending',
                  color: b.status === 'confirmed' ? '#28653F' : '#B45309',
                  details: `${b.quantity_kg} kg · ${b.delivery_address || 'Warehouse Hub'}`,
                  total: 'Pass Token Active'
                })}
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: '#FFFFFF',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: '#FDF5EC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    🏭
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>
                      Slot: {b.grain_type}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {b.booking_date} · {b.quantity_kg} kg
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: b.status === 'confirmed' ? '#28653F' : '#B45309',
                    background: b.status === 'confirmed' ? '#E7F4EB' : '#FEF3C7',
                    padding: '4px 8px',
                    borderRadius: 8
                  }}
                >
                  {b.status || 'Booked'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
