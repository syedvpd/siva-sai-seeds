import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';

export default function FarmerFields({ farmerProfile }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [cropType, setCropType] = useState('Cotton');
  const [acres, setAcres] = useState('2.5');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [harvestDate, setHarvestDate] = useState('');
  const [locationNote, setLocationNote] = useState('North Canal Plot');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCrops();
  }, []);

  async function loadCrops() {
    setLoading(true);
    setError(null);
    try {
      const data = await farmerService.getCrops();
      setCrops(data);
    } catch (err) {
      console.error('[FarmerFields] loadCrops error:', err.message);
      setError('Unable to load your crops. Please check network.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCrop(e) {
    if (e) e.preventDefault();
    if (!acres || parseFloat(acres) <= 0) {
      alert('Please enter a valid acreage.');
      return;
    }

    setSubmitting(true);
    try {
      await farmerService.registerCrop({
        crop_type: cropType,
        acres: parseFloat(acres),
        sowing_date: sowingDate,
        expected_harvest_date: harvestDate || null,
        location: locationNote,
        status: 'Growing'
      });
      setShowAddModal(false);
      loadCrops();
    } catch (err) {
      alert(err.message || 'Failed to register crop.');
    } finally {
      setSubmitting(false);
    }
  }

  const totalAcres = crops.reduce((acc, c) => acc + (parseFloat(c.acres) || 0), 0);

  return (
    <div id="screen-fields" className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header & Summary Banner */}
      <div
        style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, #15302A 0%, #1F4438 100%)',
          borderRadius: 22,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 8px 24px rgba(21, 48, 42, 0.15)'
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#7BC79A' }}>
            Registered Landholding
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>
              {totalAcres > 0 ? totalAcres.toFixed(1) : (farmerProfile?.acres_of_land || 0)}
            </span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Acres Total</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {crops.length} Active Field Plots
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#F2A63A',
            color: '#2D1F0A',
            border: 'none',
            borderRadius: 16,
            padding: '12px 16px',
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(242, 166, 58, 0.3)'
          }}
        >
          <span>＋</span> Add Crop
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* 2. Active Crops List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--forest)', letterSpacing: 0.5 }}>
            MY CROP FIELDS
          </div>
          <button
            type="button"
            onClick={loadCrops}
            style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: 'var(--canopy-deep)', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Loading your crops from database...
          </div>
        ) : crops.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px dashed var(--line)'
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>🌱</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest)' }}>No active crops registered</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, maxWidth: 260, margin: '4px auto 16px' }}>
              Add your current sown crops to track moisture, stages, and receive localized harvest alerts.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn primary"
              style={{
                background: 'var(--canopy-deep)',
                color: '#FFFFFF',
                borderRadius: 14,
                padding: '10px 22px',
                fontSize: 13.5,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Register First Crop
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="card"
                style={{
                  padding: '16px 18px',
                  background: '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: 'var(--surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22
                      }}
                    >
                      {crop.crop_type === 'Cotton' ? '🌸' : crop.crop_type === 'Maize' ? '🌽' : crop.crop_type === 'Rice' ? '🌾' : '🌱'}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                        {crop.crop_name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {crop.acres} Acres · {crop.notes || 'Main Plot'}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#28653F',
                      background: '#E7F4EB',
                      padding: '4px 10px',
                      borderRadius: 10
                    }}
                  >
                    {crop.stage || crop.status || 'Active'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    borderTop: '1px solid var(--line)',
                    fontSize: 12,
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>Sown: <strong>{crop.sowing_date}</strong></span>
                  {crop.expected_harvest_date && (
                    <span>Harvest: <strong>{crop.expected_harvest_date}</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Add Crop Modal */}
      {showAddModal && (
        <div
          id="modal-add-crop"
          className="overlay active"
          onClick={(e) => { if (e.target.id === 'modal-add-crop') setShowAddModal(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(21, 48, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '26px 26px 0 0',
              padding: '24px 20px 32px',
              animation: 'sheetUp 0.3s ease',
              maxHeight: '85%',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: 'var(--forest)' }}>
                Register New Crop
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCrop} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Crop Variety
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={{
                    width: '100%',
                    height: 48,
                    padding: '0 12px',
                    borderRadius: 14,
                    border: '1.5px solid var(--line)',
                    background: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="Cotton">Cotton (Bollgard II)</option>
                  <option value="Maize">Hybrid Maize (NK 6240)</option>
                  <option value="Paddy">Rice / Paddy (BPT 5204)</option>
                  <option value="Chilli">Chilli (Teja Variety)</option>
                  <option value="Groundnut">Groundnut (K-6)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Pulses">Red Gram / Pulses</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Field Acreage (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={acres}
                  onChange={(e) => setAcres(e.target.value)}
                  placeholder="e.g. 3.5"
                  required
                  style={{
                    width: '100%',
                    height: 48,
                    padding: '0 12px',
                    borderRadius: 14,
                    border: '1.5px solid var(--line)',
                    background: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Sowing Date
                </label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: 48,
                    padding: '0 12px',
                    borderRadius: 14,
                    border: '1.5px solid var(--line)',
                    background: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Plot Location / Identifier (Optional)
                </label>
                <input
                  type="text"
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  placeholder="e.g. North Plot / Canal Field"
                  style={{
                    width: '100%',
                    height: 48,
                    padding: '0 12px',
                    borderRadius: 14,
                    border: '1.5px solid var(--line)',
                    background: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn primary block"
                  style={{
                    background: 'var(--canopy-deep)',
                    color: '#FFFFFF',
                    borderRadius: 16,
                    height: 50,
                    fontSize: 15,
                    fontWeight: 800,
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {submitting ? 'Registering...' : 'Save & Register Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
