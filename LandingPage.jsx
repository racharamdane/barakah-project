// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--olive) 0%, #1a3312 100%)',
        color: 'var(--white)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '.85rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 16 }}>
          Algeria's food rescue marketplace
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.15, maxWidth: 700, margin: '0 auto 20px' }}>
          Great food.<br />Half the price.
        </h1>
        <p style={{ color: '#b8d4a8', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Restaurants near you have delicious end-of-day food that would otherwise go to waste.
          Barakah connects you to it — freshly prepared, at a fraction of the price.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            Find bags near me
          </Link>
          <Link to="/restaurant/register" className="btn btn-ghost btn-lg" style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,.35)' }}>
            I'm a restaurant →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 className="display" style={{ textAlign: 'center', fontSize: '1.9rem', color: 'var(--olive)', marginBottom: 48 }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {[
            { n: '01', icon: '📍', title: 'Pick your city', body: 'Browse surprise bags posted by restaurants in your wilaya.' },
            { n: '02', icon: '🛍️', title: 'Choose a bag', body: 'See the price, the collection window, and how many bags are left.' },
            { n: '03', icon: '⏰', title: 'Collect on time', body: 'Head to the restaurant within the posted collection window.' },
            { n: '04', icon: '🌿', title: 'Reduce waste', body: 'You save money, the restaurant recovers cost, and good food doesn\'t go to landfill.' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{s.icon}</div>
              <p style={{ fontSize: '.72rem', color: 'var(--saffron-dark)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>{s.n}</p>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant CTA */}
      <section style={{ background: 'var(--saffron-light)', padding: '64px 24px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 className="display" style={{ fontSize: '1.8rem', color: 'var(--olive)', marginBottom: 12 }}>
          Own a restaurant?
        </h2>
        <p style={{ color: 'var(--ink-mid)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Post your unsold food in under 2 minutes. Set your price, your collection time, and how many bags. It's free to join.
        </p>
        <Link to="/restaurant/register" className="btn btn-olive btn-lg">
          Register your restaurant
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '28px 24px', color: 'var(--ink-soft)', fontSize: '.82rem', borderTop: '1px solid var(--border)' }}>
        © {new Date().getFullYear()} Barakah · Made with 💚 for Algeria
      </footer>
    </div>
  );
}
