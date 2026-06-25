// src/pages/restaurant/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import BagCard from '../../components/shared/BagCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const EMPTY_FORM = {
  originalPrice: '',
  reducedPrice: '',
  totalBags: '',
  collectionStart: '',
  collectionEnd: '',
  description: '',
};

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [offers, setOffers]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editing, setEditing]   = useState(null);  // offer id being edited
  const [formError, setFormError]   = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchMyOffers(); }, []);

  async function fetchMyOffers() {
    setLoading(true);
    try {
      const res = await api.get('/offers/mine');
      setOffers(res.data);
    } finally {
      setLoading(false);
    }
  }

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function startEdit(offer) {
    setForm({
      originalPrice:   String(offer.original_price),
      reducedPrice:    String(offer.reduced_price),
      totalBags:       String(offer.total_bags),
      collectionStart: offer.collection_start,
      collectionEnd:   offer.collection_end,
      description:     offer.description || '',
    });
    setEditing(offer.id);
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setFormError('');
    setFormSuccess('');
  }

  async function toggleActive(offer) {
    try {
      await api.put(`/offers/${offer.id}`, { isActive: !offer.is_active });
      fetchMyOffers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteOffer(id) {
    if (!window.confirm('Delete this offer? This cannot be undone.')) return;
    try {
      await api.delete(`/offers/${id}`);
      fetchMyOffers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function submitForm(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      if (editing) {
        await api.put(`/offers/${editing}`, form);
        setFormSuccess('Offer updated successfully.');
      } else {
        await api.post('/offers', form);
        setFormSuccess('Offer posted! Customers can now see it.');
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      setShowForm(false);
      fetchMyOffers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const discount = form.originalPrice && form.reducedPrice
    ? Math.round((1 - Number(form.reducedPrice) / Number(form.originalPrice)) * 100)
    : null;

  return (
    <div className="page-content">
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="display" style={{ fontSize: '2rem', color: 'var(--olive)' }}>
              🏪 {user?.name}
            </h1>
            <p style={{ color: 'var(--ink-soft)', marginTop: 4 }}>
              {user?.city} · {user?.phone}
            </p>
          </div>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Post a new offer
            </button>
          )}
        </div>

        {/* ── Offer Form ───────────────────────────────────────── */}
        {showForm && (
          <div className="card" style={{ marginBottom: 40, padding: 28 }}>
            <h2 className="display" style={{ fontSize: '1.3rem', color: 'var(--olive)', marginBottom: 20 }}>
              {editing ? 'Edit offer' : 'Post a new surprise bag'}
            </h2>

            {formError   && <div className="alert alert-error"   style={{ marginBottom: 16 }}>{formError}</div>}
            {formSuccess  && <div className="alert alert-success" style={{ marginBottom: 16 }}>{formSuccess}</div>}

            <form onSubmit={submitForm} style={{ display: 'grid', gap: 18 }}>

              {/* Prices row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Original price (DA)</label>
                  <input
                    className="form-input"
                    type="number" name="originalPrice" value={form.originalPrice}
                    onChange={handle} required min="1" placeholder="e.g. 1200"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Reduced price (DA)
                    {discount !== null && discount > 0 && (
                      <span className="badge badge-terra" style={{ marginLeft: 8 }}>−{discount}%</span>
                    )}
                  </label>
                  <input
                    className="form-input"
                    type="number" name="reducedPrice" value={form.reducedPrice}
                    onChange={handle} required min="1" placeholder="e.g. 500"
                  />
                </div>
              </div>

              {/* Bags */}
              <div className="form-group" style={{ maxWidth: 200 }}>
                <label className="form-label">Number of bags</label>
                <input
                  className="form-input"
                  type="number" name="totalBags" value={form.totalBags}
                  onChange={handle} required min="1" placeholder="e.g. 5"
                />
              </div>

              {/* Collection window */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Collection start</label>
                  <input
                    className="form-input"
                    type="time" name="collectionStart" value={form.collectionStart}
                    onChange={handle} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Collection end</label>
                  <input
                    className="form-input"
                    type="time" name="collectionEnd" value={form.collectionEnd}
                    onChange={handle} required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description / notes <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                <textarea
                  className="form-textarea"
                  name="description" value={form.description}
                  onChange={handle}
                  placeholder="E.g. Assortment of pastries and bread from today — always a surprise!"
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-olive" type="submit" disabled={submitting}>
                  {submitting ? 'Saving…' : editing ? 'Save changes' : 'Post offer'}
                </button>
                <button className="btn btn-ghost" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── My Offers ────────────────────────────────────────── */}
        <h2 className="display" style={{ fontSize: '1.3rem', color: 'var(--olive)', marginBottom: 20 }}>
          Your active offers
        </h2>

        {loading ? <LoadingSpinner /> : offers.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '2rem', marginBottom: 12 }}>🍞</p>
            <h3>No offers yet</h3>
            <p>Post your first surprise bag to start attracting customers.</p>
          </div>
        ) : (
          <div className="offer-grid">
            {offers.map(offer => (
              <BagCard
                key={offer.id}
                offer={{ ...offer, restaurant_name: user?.name, restaurant_phone: user?.phone }}
                actions={
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(offer)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleActive(offer)}
                      style={{ color: offer.is_active ? 'var(--terra)' : 'var(--olive)' }}
                    >
                      {offer.is_active ? '⏸ Pause' : '▶ Activate'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteOffer(offer.id)}>
                      🗑 Delete
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
