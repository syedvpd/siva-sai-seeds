import React from 'react';

export default function FarmerInvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <div
      id="modal-invoice"
      className="overlay active"
      onClick={(e) => { if (e.target.id === 'modal-invoice') onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(21, 48, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 20px',
          width: '100%',
          maxWidth: 340,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        {/* Success / Check Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#E7F4EB',
            color: '#28653F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div
          id="invoice-title"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--forest)'
          }}
        >
          {invoice.title || 'Purchase Successful'}
        </div>

        <div
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            marginTop: 4,
            fontWeight: 600
          }}
        >
          Invoice #{invoice.orderId || invoice.id || 'INV-1029'}
        </div>

        {/* Invoice Summary Box */}
        <div
          style={{
            width: '100%',
            background: 'var(--bg)',
            borderRadius: 16,
            padding: 16,
            margin: '18px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Date:</span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{invoice.date || new Date().toLocaleDateString('en-IN')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <span style={{ fontWeight: 800, color: invoice.color || '#28653F' }}>{invoice.status || 'Confirmed'}</span>
          </div>

          {invoice.details && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Item:</span>
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>{invoice.details}</span>
            </div>
          )}

          <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: 'var(--forest)' }}>Total Amount:</span>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--forest)' }}>{invoice.total || '₹0.00'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'var(--canopy-deep)',
            color: '#FFFFFF',
            borderRadius: 14,
            width: '100%',
            height: 46,
            fontWeight: 800,
            fontSize: 14.5,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
