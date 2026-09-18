import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';

export default function FarmerGrainSales({ onOpenInvoice }) {
  const [marketRates, setMarketRates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal State
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [grainType, setGrainType] = useState('Cotton');
  const [quantityKg, setQuantityKg] = useState('2000');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [warehouseId, setWarehouseId] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('Kalluru Farm');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [rates, slots, whs] = await Promise.all([
        farmerService.getMarketRates().catch(() => []),
        farmerService.getBookingSlots().catch(() => []),
        farmerService.getWarehouses().catch(() => [])
      ]);
      setMarketRates(rates);
      setBookings(slots);
      setWarehouses(whs);
    } catch (err) {
      console.error('[FarmerGrainSales] loadData error:', err.message);
      setError('Unable to load market rates. Please check network.');
    } finally {
      setLoading(false);
    }
  }

  async function handleBookSlot(e) {
    if (e) e.preventDefault();
    if (!quantityKg || parseFloat(quantityKg) <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await farmerService.bookDeliverySlot({
        grain_type: grainType,
        quantity_kg: parseFloat(quantityKg),
        booking_date: bookingDate,
        warehouse_id: warehouseId,
        delivery_address: deliveryAddress
      });

      setShowSlotModal(false);
      loadData();

      if (onOpenInvoice) {
        onOpenInvoice({
          title: `Warehouse Slot (${grainType})`,
          orderId: `SLOT-${res.booking?.id || Math.floor(1000 + Math.random() * 9000)}`,
          date: bookingDate,
          status: 'Confirmed',
          color: '#28653F',
          details: `${quantityKg} kg · ${deliveryAddress}`,
          total: 'Delivery Pass Active'
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to book slot.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="screen-grain-sales" className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Banner & Booking CTA */}
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
            Grain Procurement Hub
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Fraunces', serif", marginTop: 4 }}>
            Direct Warehouse Drop
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
            Guaranteed MSP payout with no mandi queue
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSlotModal(true)}
          style={{
            background: '#F2A63A',
            color: '#2D1F0A',
            border: 'none',
            borderRadius: 16,
            padding: '12px 16px',
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(242, 166, 58, 0.3)'
          }}
        >
          Book Slot
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* 2. Today's APMC Mandi Market Rates */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--forest)', letterSpacing: 0.5 }}>
            TODAY'S MANDI RATES (KURNOOL REGION)
          </div>
          <button
            type="button"
            onClick={loadData}
            style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: 'var(--canopy-deep)', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Loading live rates...
          </div>
        ) : marketRates.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: 18,
              border: '1.5px dashed var(--line)'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>📈</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--forest)' }}>No rate data currently posted</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Daily APMC rates will be refreshed by the zone manager.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {marketRates.map((rate) => (
              <div
                key={rate.id}
                className="card"
                style={{
                  padding: '14px 16px',
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                    {rate.crop_type}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: 'var(--canopy-deep)',
                      background: 'var(--surface-alt)',
                      padding: '2px 6px',
                      borderRadius: 6
                    }}
                  >
                    Grade {rate.grade}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--forest)', marginTop: 4 }}>
                  ₹{rate.price_per_kg ? (rate.price_per_kg * 100).toLocaleString('en-IN') : '0'} <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>/ Qtl</span>
                </div>
                <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, marginTop: 2 }}>
                  ₹{rate.price_per_kg} / Kg
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. My Active Delivery Bookings */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--forest)', marginBottom: 10, letterSpacing: 0.5 }}>
          MY SCHEDULED WAREHOUSE SLOTS
        </div>

        {bookings.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: 18,
              border: '1.5px dashed var(--line)'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>🚚</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--forest)' }}>No scheduled slots</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Book a warehouse arrival slot before harvesting for direct gate-in.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bookings.map((slot) => (
              <div
                key={slot.id}
                className="card"
                style={{
                  padding: '14px 16px',
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
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
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                      {slot.grain_type} Delivery
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                      {slot.booking_date} · {slot.quantity_kg} kg
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: slot.status === 'confirmed' ? '#28653F' : '#B45309',
                    background: slot.status === 'confirmed' ? '#E7F4EB' : '#FEF3C7',
                    padding: '4px 10px',
                    borderRadius: 8
                  }}
                >
                  {slot.status || 'Confirmed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Slot Booking Modal */}
      {showSlotModal && (
        <div
          id="modal-book-slot"
          className="overlay active"
          onClick={(e) => { if (e.target.id === 'modal-book-slot') setShowSlotModal(false); }}
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
                Book Warehouse Drop-off Slot
              </div>
              <button
                type="button"
                onClick={() => setShowSlotModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSlot} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Select Warehouse Location
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
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
                  <option value={1}>Kurnool Central Warehouse Hub</option>
                  <option value={2}>Nandyal Agri Storage Facility</option>
                  <option value={3}>Adoni Grain Terminal</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Grain Crop Type
                </label>
                <select
                  value={grainType}
                  onChange={(e) => setGrainType(e.target.value)}
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
                  <option value="Cotton">Cotton (Kapus)</option>
                  <option value="Maize">Yellow Maize</option>
                  <option value="Paddy">Paddy / Rice</option>
                  <option value="Groundnut">Groundnut (Pods)</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Estimated Quantity (in Kg)
                </label>
                <input
                  type="number"
                  step="100"
                  min="100"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  placeholder="e.g. 2500"
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
                  Delivery Date Slot
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
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
                  Origin Farm / Village Address
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Kalluru Farm, Plot #14"
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
                  {submitting ? 'Booking Slot...' : 'Confirm Delivery Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
