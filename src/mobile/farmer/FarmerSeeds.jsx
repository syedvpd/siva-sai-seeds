import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';

export default function FarmerSeeds({ onOpenInvoice }) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'history'
  const [seeds, setSeeds] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Purchase Modal State
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [grade, setGrade] = useState('A');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [warehouse, setWarehouse] = useState('Kurnool Central Warehouse Hub');
  const [warehouses, setWarehouses] = useState([]);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadSeeds();
    loadWarehouses();
    loadPurchases();
  }, []);

  async function loadSeeds() {
    setLoading(true);
    setError(null);
    try {
      const data = await farmerService.getSeeds();
      setSeeds(data);
    } catch (err) {
      console.error('[FarmerSeeds] loadSeeds error:', err.message);
      setError('Unable to load seed catalogue. Please check connection.');
    } finally {
      setLoading(false);
    }
  }

  async function loadPurchases() {
    try {
      const data = await farmerService.getSeedPurchases();
      setPurchases(data);
    } catch (err) {
      console.error('[FarmerSeeds] loadPurchases error:', err.message);
    }
  }

  async function loadWarehouses() {
    try {
      const data = await farmerService.getWarehouses();
      setWarehouses(data);
    } catch (_) {}
  }

  function handleQtyChange(seedId, delta) {
    const current = quantities[seedId] || 1;
    const next = Math.max(1, Math.min(50, current + delta));
    setQuantities({ ...quantities, [seedId]: next });
  }

  function handleOpenPurchase(seed) {
    setSelectedSeed(seed);
    setGrade('A');
  }

  async function handleConfirmPurchase() {
    if (!selectedSeed) return;
    const qty = quantities[selectedSeed.id] || 1;
    const price = selectedSeed.price_per_kg || 50;
    const total = qty * price;

    setPurchasing(true);
    try {
      const res = await farmerService.purchaseSeeds({
        seedId: selectedSeed.id,
        quantity: qty,
        totalPrice: total,
        grade,
        warehouse,
        pickupDate
      });

      const invoiceData = {
        title: `${selectedSeed.name} Purchase`,
        orderId: res.orderId,
        date: new Date().toLocaleDateString('en-IN'),
        status: 'Unpaid (Pay at Warehouse)',
        color: '#EA580C',
        details: `${qty} kg · Grade ${grade} · ${warehouse}`,
        total: `₹${total.toLocaleString('en-IN')}`
      };

      setSelectedSeed(null);
      loadPurchases();
      onOpenInvoice(invoiceData);
    } catch (err) {
      alert(err.message || 'Failed to place seed order.');
    } finally {
      setPurchasing(false);
    }
  }

  const categories = ['All', 'Cotton', 'Rice', 'Wheat', 'Maize', 'Pulses'];

  const filteredSeeds = seeds.filter((s) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Rice' && (s.crop_type === 'Rice' || s.name?.toLowerCase().includes('rice') || s.name?.toLowerCase().includes('paddy'))) return true;
    return s.crop_type?.toLowerCase() === selectedCategory.toLowerCase() || s.name?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div id="screen-seed-purchase" className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Tab Toggle Header */}
      <div
        style={{
          display: 'flex',
          background: 'var(--surface-alt)',
          padding: 4,
          borderRadius: 16
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            borderRadius: 12,
            background: activeTab === 'browse' ? 'var(--canopy-deep)' : 'transparent',
            color: activeTab === 'browse' ? '#FFFFFF' : 'var(--text-muted)',
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Browse Certified Seeds
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            borderRadius: 12,
            background: activeTab === 'history' ? 'var(--canopy-deep)' : 'transparent',
            color: activeTab === 'history' ? '#FFFFFF' : 'var(--text-muted)',
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          My Orders ({purchases.length})
        </button>
      </div>

      {/* 2. Subview: Browse Seeds */}
      {activeTab === 'browse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Filter Chips */}
          <div className="chip-row" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map((cat) => (
              <div
                key={cat}
                className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 100,
                  fontSize: 12.5,
                  fontWeight: 700,
                  background: selectedCategory === cat ? 'var(--forest)' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-muted)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--forest)' : 'var(--line)'}`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </div>
            ))}
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Loading seeds from database...
            </div>
          ) : filteredSeeds.length === 0 ? (
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
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--forest)' }}>No seeds available in this category</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Check back soon or select another crop category.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredSeeds.map((seed) => {
                const qty = quantities[seed.id] || 1;
                return (
                  <div
                    key={seed.id}
                    className="card"
                    style={{
                      padding: '16px',
                      background: '#FFFFFF',
                      borderRadius: 18,
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(21, 48, 42, 0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: '#F0F8EC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {seed.image_url ? (
                          <img
                            src={seed.image_url}
                            alt={seed.name}
                            onError={(e) => { e.target.style.display = 'none'; }}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          '🌱'
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                          {seed.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          {seed.variety || 'Certified High Yield'} · {seed.stock_kg ? `${seed.stock_kg} kg in stock` : 'In Stock'}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--canopy-deep)', marginTop: 4 }}>
                          ₹{seed.price_per_kg} <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>/ Kg</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      {/* Qty Selector */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'var(--bg)',
                          borderRadius: 10,
                          padding: '3px 6px'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleQtyChange(seed.id, -1)}
                          style={{ border: 'none', background: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', padding: '0 4px' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 800, minWidth: 20, textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(seed.id, 1)}
                          style={{ border: 'none', background: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', padding: '0 4px' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenPurchase(seed)}
                        style={{
                          background: '#F2A63A',
                          color: '#2D1F0A',
                          border: 'none',
                          borderRadius: 12,
                          padding: '8px 16px',
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Subview: Purchase History */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {purchases.length === 0 ? (
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
              <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--forest)' }}>No previous orders found</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Orders placed from the catalogue will be listed here with receipts.
              </p>
            </div>
          ) : (
            purchases.map((p) => (
              <div
                key={p.id}
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
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                      {p.seeds?.name || 'Seed Order'}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(p.created_at).toLocaleDateString('en-IN')} · {p.quantity_kg} kg
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--forest)' }}>
                    ₹{p.total_price}
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: p.status === 'delivered' ? '#28653F' : '#B45309',
                      background: p.status === 'delivered' ? '#E7F4EB' : '#FEF3C7',
                      padding: '2px 6px',
                      borderRadius: 6,
                      display: 'inline-block',
                      marginTop: 2
                    }}
                  >
                    {p.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Purchase Modal */}
      {selectedSeed && (
        <div
          id="modal-purchase"
          className="overlay active"
          onClick={(e) => { if (e.target.id === 'modal-purchase') setSelectedSeed(null); }}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: 'var(--forest)' }}>
                  Purchase {selectedSeed.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--canopy-deep)', fontWeight: 700, marginTop: 2 }}>
                  ₹{selectedSeed.price_per_kg} / Kg
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSeed(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Grade Selector */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Crop Grade Certification
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['A', 'B', 'C'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      style={{
                        padding: '10px 0',
                        borderRadius: 12,
                        border: `1.5px solid ${grade === g ? 'var(--canopy-deep)' : 'var(--line)'}`,
                        background: grade === g ? 'var(--surface-alt)' : '#FFFFFF',
                        color: grade === g ? 'var(--canopy-deep)' : 'var(--text)',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Grade {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warehouse Pickup Location */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Pickup Warehouse Hub
                </label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
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
                  <option value="Kurnool Central Warehouse Hub">Kurnool Central Warehouse Hub</option>
                  <option value="Nandyal Agri Storage Facility">Nandyal Agri Storage Facility</option>
                  <option value="Adoni Grain Terminal">Adoni Grain Terminal</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
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

              {/* Summary Bar */}
              <div
                style={{
                  background: 'var(--bg)',
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 4
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Total ({quantities[selectedSeed.id] || 1} kg × ₹{selectedSeed.price_per_kg})
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--forest)' }}>
                    ₹{((quantities[selectedSeed.id] || 1) * (selectedSeed.price_per_kg || 0)).toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={purchasing}
                  onClick={handleConfirmPurchase}
                  style={{
                    background: 'var(--canopy-deep)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: purchasing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {purchasing ? 'Booking...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
