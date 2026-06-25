// src/components/shared/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const dashPath = user?.role === 'restaurant' ? '/restaurant/dashboard' : '/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          bara<span>kah</span> 🛍️
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to={dashPath} className="btn btn-ghost btn-sm">
                {user.role === 'restaurant' ? '🏪 My Offers' : '🏠 Browse'}
              </Link>
              <span style={{ fontSize: '.85rem', color: 'var(--ink-soft)' }}>
                {user.name || user.fullName || user.email}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Customer login</Link>
              <Link to="/restaurant/login" className="btn btn-olive btn-sm">Restaurant login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
