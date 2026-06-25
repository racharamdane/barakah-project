// src/pages/customer/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { ALGERIA_CITIES } from '../../utils/api';

export default function CustomerRegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', city: '', password: '', confirm: ''
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    try {
      const res = await api.post('/customers/register', {
        fullName: form.fullName,
        email:    form.email,
        phone:    form.phone,
        city:     form.city,
        password: form.password,
      });
      login(res.data.token, { ...res.data.customer, role: 'customer' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title display">Create your account</h1>
        <p className="auth-subtitle">Save food, save money — join Barakah today.</p>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" name="fullName" value={form.fullName} onChange={handle} required placeholder="Amira Benali" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handle} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input className="form-input" type="tel" name="phone" value={form.phone} onChange={handle} required placeholder="0550 123 456" />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <select className="form-select" name="city" value={form.city} onChange={handle} required>
              <option value="">Select your city…</option>
              {ALGERIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handle} required minLength={6} placeholder="At least 6 characters" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input className="form-input" type="password" name="confirm" value={form.confirm} onChange={handle} required placeholder="Repeat your password" />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        <p className="auth-switch" style={{ marginTop: 8 }}>
          Are you a restaurant? <Link to="/restaurant/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
