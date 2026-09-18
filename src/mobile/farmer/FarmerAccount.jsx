import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';

export default function FarmerAccount({
  farmerProfile,
  onOpenLanguageModal,
  onLogout
}) {
  const [subView, setSubView] = useState('main'); // 'main' | 'agri' | 'bank' | 'docs' | 'transactions' | 'help' | 'terms'
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);

  // Bank Form State
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankName, setBankName] = useState(farmerProfile?.bank_name || 'State Bank of India');
  const [accountNumber, setAccountNumber] = useState(farmerProfile?.bank_account_number || '');
  const [ifsc, setIfsc] = useState(farmerProfile?.bank_ifsc || '');
  const [savingBank, setSavingBank] = useState(false);

  useEffect(() => {
    if (subView === 'transactions') {
      loadTransactions();
    }
  }, [subView]);

  async function loadTransactions() {
    setLoadingTx(true);
    try {
      const data = await farmerService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('[FarmerAccount] loadTransactions error:', err.message);
    } finally {
      setLoadingTx(false);
    }
  }

  async function handleSaveBank(e) {
    if (e) e.preventDefault();
    setSavingBank(true);
    try {
      await farmerService.requestBankChange({
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifsc
      });
      alert('Bank update request submitted successfully. It will be verified by the admin.');
      setShowBankModal(false);
    } catch (err) {
      alert(err.message || 'Failed to submit bank request.');
    } finally {
      setSavingBank(false);
    }
  }

  const name = farmerProfile?.name || 'Farmer';
  const phone = farmerProfile?.phone || '';
  const farmerId = farmerProfile?.id ? `FMR-AP-518004-${farmerProfile.id}` : 'FMR-AP-518004';
  const acres = farmerProfile?.acres_of_land || 8.5;
  const village = farmerProfile?.village || 'Kalluru';
  const district = farmerProfile?.district || 'Kurnool';

  // Sub-screen back header
  const SubHeader = ({ title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <button
        type="button"
        onClick={() => setSubView('main')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--forest)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          padding: 0
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: 'var(--forest)' }}>
        {title}
      </div>
    </div>
  );

  // 1. Agriculture Details Subview
  if (subView === 'agri') {
    return (
      <div className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SubHeader title="Agricultural Details" />
        <div className="card" style={{ padding: 18, background: '#FFFFFF', borderRadius: 18, border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Landholding</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--forest)', marginTop: 2 }}>{acres} Acres</div>
          </div>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Soil Type</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>Black Cotton Soil (Deep)</div>
          </div>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Primary Irrigation Source</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>Borewell + Drip Irrigation System</div>
          </div>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Survey Numbers</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>Sy. No. 142/A, 142/B, 145/2</div>
          </div>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Farm Location</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{farmerProfile?.crop_address || `${village}, ${district}, Andhra Pradesh`}</div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Bank Details Subview
  if (subView === 'bank') {
    return (
      <div className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SubHeader title="Bank & Payout Details" />
        <div className="card" style={{ padding: 18, background: '#FFFFFF', borderRadius: 18, border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bank Name</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--forest)', marginTop: 2 }}>{farmerProfile?.bank_name || 'State Bank of India'}</div>
          </div>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Account Number</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginTop: 2, fontFamily: 'monospace' }}>
              {farmerProfile?.bank_account_number ? `•••• •••• ${farmerProfile.bank_account_number.slice(-4)}` : 'Not provided yet'}
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>IFSC Code</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{farmerProfile?.bank_ifsc || 'SBIN0001234'}</div>
          </div>
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>MSP Direct Transfer Status</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#28653F', marginTop: 2 }}>Active · Aadhaar Linked (DBT Enabled)</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBankModal(true)}
          className="btn primary block"
          style={{ background: 'var(--canopy-deep)', color: '#FFFFFF', borderRadius: 14, height: 48, fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer' }}
        >
          Update Bank Details
        </button>

        {showBankModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 9999 }}>
            <div style={{ width: '100%', background: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Request Bank Update</div>
                <button onClick={() => setShowBankModal(false)} style={{ border: 'none', background: 'none', fontSize: 20 }}>✕</button>
              </div>
              <form onSubmit={handleSaveBank} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bank Name</label>
                  <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} required style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 12, border: '1px solid var(--line)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Account Number</label>
                  <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 12, border: '1px solid var(--line)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>IFSC Code</label>
                  <input type="text" value={ifsc} onChange={(e) => setIfsc(e.target.value)} required style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 12, border: '1px solid var(--line)' }} />
                </div>
                <button type="submit" disabled={savingBank} className="btn primary block" style={{ background: 'var(--canopy-deep)', color: '#FFFFFF', borderRadius: 14, height: 48, marginTop: 8 }}>
                  {savingBank ? 'Submitting...' : 'Submit Update Request'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Farm Documents Subview
  if (subView === 'docs') {
    return (
      <div className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SubHeader title="Farm Documents" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="card" style={{ padding: 16, background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>📄</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Pattadar Passbook</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Verified by Kurnool Revenue Dept</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#28653F', background: '#E7F4EB', padding: '4px 8px', borderRadius: 6 }}>Verified</span>
          </div>

          <div className="card" style={{ padding: 16, background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🪪</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Aadhaar Card (KYC)</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>UIDAI Authentication Confirmed</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#28653F', background: '#E7F4EB', padding: '4px 8px', borderRadius: 6 }}>Verified</span>
          </div>

          <div className="card" style={{ padding: 16, background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🧪</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Soil Health Card</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>NPK & Micronutrients Test 2026</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#28653F', background: '#E7F4EB', padding: '4px 8px', borderRadius: 6 }}>Current</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Transactions Ledger Subview
  if (subView === 'transactions') {
    return (
      <div className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SubHeader title="Transaction Ledger" />
        {loadingTx ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
        ) : transactions.length === 0 ? (
          <div className="card" style={{ padding: 28, textAlign: 'center', background: '#FFFFFF', borderRadius: 16, border: '1px dashed var(--line)' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🧾</div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>No transaction history found</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Completed grain sales and purchases will reflect here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {transactions.map((tx) => (
              <div key={tx.id} className="card" style={{ padding: 14, background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{tx.description || tx.type}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{tx.created_at || tx.date} · #{tx.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--forest)' }}>₹{tx.amount?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#28653F' }}>{tx.status || 'Completed'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 5. Help & Helpline Subview
  if (subView === 'help') {
    return (
      <div className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SubHeader title="Farmer Helpline & Support" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href="tel:18004251234"
            className="card"
            style={{ padding: 18, background: '#FFFFFF', borderRadius: 18, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-alt)', color: 'var(--canopy-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              📞
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Toll-Free Agri Helpline</div>
              <div style={{ fontSize: 13, color: 'var(--canopy-deep)', fontWeight: 700, marginTop: 2 }}>1800-425-1234 (6 AM - 8 PM)</div>
            </div>
          </a>

          <a
            href="tel:+919440123456"
            className="card"
            style={{ padding: 18, background: '#FFFFFF', borderRadius: 18, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--amber-soft)', color: '#8A5C15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              🌾
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Kurnool Agri Extension Officer</div>
              <div style={{ fontSize: 13, color: 'var(--canopy-deep)', fontWeight: 700, marginTop: 2 }}>+91 94401 23456</div>
            </div>
          </a>

          <div className="card" style={{ padding: 18, background: '#FFFFFF', borderRadius: 18, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--forest)', marginBottom: 4 }}>Head Office & Processing Plant</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Sri Siva Sai Seeds Pvt. Ltd.<br />
              Plot No. 18/B, Industrial Area, Nandyal Road,<br />
              Kurnool, Andhra Pradesh, 518004.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 6. Main Account Menu
  return (
    <div id="screen-account" className="screen active" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Farmer Profile Card */}
      <div
        className="card"
        style={{
          padding: '20px 18px',
          background: 'linear-gradient(135deg, #15302A 0%, #1F4438 100%)',
          borderRadius: 22,
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(21, 48, 42, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#FFFFFF',
              color: 'var(--forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            {name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>
                {name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: '#4ADE80',
                  color: '#0B1512',
                  padding: '2px 6px',
                  borderRadius: 6
                }}
              >
                VERIFIED
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
              {phone ? `+91 ${phone}` : 'Mobile registered'}
            </div>
            <div style={{ fontSize: 11, color: '#7BC79A', marginTop: 2, fontWeight: 600 }}>
              ID: {farmerId} · {village}, {district}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          className="card"
          onClick={() => setSubView('agri')}
          style={{
            padding: '16px 18px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20 }}>🌾</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>Agricultural Details</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </div>

        <div
          className="card"
          onClick={() => setSubView('bank')}
          style={{
            padding: '16px 18px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20 }}>🏦</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>Bank & Payout Details</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </div>

        <div
          className="card"
          onClick={() => setSubView('docs')}
          style={{
            padding: '16px 18px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20 }}>📑</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>Farm Documents & KYC</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </div>

        <div
          className="card"
          onClick={() => setSubView('transactions')}
          style={{
            padding: '16px 18px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20 }}>🧾</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>Transaction Ledger</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </div>

        <div
          className="card"
          onClick={onOpenLanguageModal}
          style={{
            padding: '16px 18px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20 }}>🌐</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>Change Language (భాష)</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </div>

        <div
          className="card"
          onClick={() => setSubView('help')}
          style={{
            padding: '16px 18px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20 }}>📞</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>Farmer Helpline & Support</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </div>
      </div>

      {/* Logout Action */}
      <div style={{ marginTop: 8, paddingBottom: 16 }}>
        <button
          type="button"
          onClick={onLogout}
          className="btn ghost block"
          style={{
            background: '#FFFFFF',
            color: '#DC2626',
            border: '1.5px solid #FCA5A5',
            borderRadius: 16,
            height: 50,
            fontSize: 14.5,
            fontWeight: 800,
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}
