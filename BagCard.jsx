// src/components/shared/BagCard.jsx
import React from 'react';

export default function BagCard({ offer, actions }) {
  const discount = Math.round((1 - offer.reduced_price / offer.original_price) * 100);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header strip */}
      <div style={{
        background: 'var(--saffron-light)',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <p style={{ fontSize: '.75rem', color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {offer.city}
          </p>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>
            {offer.restaurant_name}
          </h3>
        </div>
        <span className="badge badge-terra" style={{ flexShrink: 0 }}>−{discount}%</span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--olive)' }}>
            {offer.reduced_price.toLocaleString()} DA
          </span>
          <span style={{ fontSize: '.9rem', textDecoration: 'line-through', color: 'var(--ink-soft)' }}>
            {offer.original_price.toLocaleString()} DA
          </span>
        </div>

        {/* Info rows */}
        <InfoRow icon="🕐" label="Collect">
          {offer.collection_start} – {offer.collection_end}
        </InfoRow>
        <InfoRow icon="🛍️" label="Available">
          <BagsLeft remaining={offer.bags_remaining} total={offer.total_bags} />
        </InfoRow>
        {offer.restaurant_phone && (
          <InfoRow icon="📞" label="Contact">
            {offer.restaurant_phone}
          </InfoRow>
        )}

        {/* Description */}
        {offer.description && (
          <p style={{ fontSize: '.85rem', color: 'var(--ink-mid)', marginTop: 4, fontStyle: 'italic' }}>
            "{offer.description}"
          </p>
        )}
      </div>

      {/* Actions slot */}
      {actions && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.88rem' }}>
      <span>{icon}</span>
      <span style={{ color: 'var(--ink-soft)', minWidth: 60 }}>{label}</span>
      <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function BagsLeft({ remaining, total }) {
  const color = remaining === 0
    ? 'var(--terra)'
    : remaining <= 2 ? 'var(--saffron-dark)' : 'var(--olive)';
  return (
    <span style={{ color, fontWeight: 600 }}>
      {remaining === 0 ? 'Sold out' : `${remaining} of ${total} left`}
    </span>
  );
}
