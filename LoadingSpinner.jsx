// src/components/shared/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div className="spinner-wrap" style={{ flexDirection: 'column', gap: 12 }}>
      <div className="spinner" />
      <p style={{ color: 'var(--ink-soft)', fontSize: '.88rem' }}>{text}</p>
    </div>
  );
}
