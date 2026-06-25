// src/pages/customer/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api, { ALGERIA_CITIES } from '../../utils/api';
import BagCard from '../../components/shared/BagCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [offers, setOffers]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [cityFilter, setCityFilter] = useState(user?.city || '');
  const [search, setSearch]     = useState('');

  useEffect(() => {
    fetchOffers();
  }, [cityFilter]);

  async function fetchOffers() {
    setLoading(true);
    setError('');
    try {
      const params = cityFilter ? { city: cityFilter } : {};
      const res = await api.get('/offers', { params });
      setOffers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = offers.filter(o =>
    o.restaurant_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="display" style={{ fontSize: '2rem', color: 'var(--olive)' }}>
            Today's surprise bags 🛍️
          </h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 4 }}>
            Good food at half the price — collect before it's gone.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          <input
            className="form-input"
            style={{ maxWidth: 220 }}
            placeholder="Search restaurant…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
          >
            <option value="">All cities</option>
            {ALGERIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {cityFilter && (
            <button className="btn btn-ghost btn-sm" onClick={() => setCityFilter('')}>
              Clear filter ✕
            </button>
          )}
        </div>

        {/* Content */}
        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
        {loading ? <LoadingSpinner text="Finding surprise bags near you…" /> : (
          filtered.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🍽️</p>
              <h3>No bags available right now</h3>
              <p>Check back later — restaurants post new offers throughout the day.</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--ink-soft)', fontSize: '.88rem', marginBottom: 16 }}>
                {filtered.length} offer{filtered.length !== 1 ? 's' : ''} available
              </p>
              <div className="offer-grid">
                {filtered.map(offer => (
                  <BagCard key={offer.id} offer={offer} />
                ))}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
