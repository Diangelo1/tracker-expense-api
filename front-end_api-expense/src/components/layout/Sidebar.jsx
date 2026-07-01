import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { to: '/',           icon: '◈', label: 'Dashboard'  },
  { to: '/expenses',   icon: '💳', label: 'Despesas'   },
  { to: '/categories', icon: '🏷️', label: 'Categorias' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: 'var(--sidebar-w)',
      background: 'var(--clr-surface)',
      borderRight: '1px solid var(--clr-border)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
      padding: '0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--clr-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--clr-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>💰</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Expense</div>
            <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', marginTop: -2 }}>Tracker Pro</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--clr-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 8px', marginBottom: 4 }}>
          Menu
        </div>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              fontSize: 14, fontWeight: 500,
              color: isActive ? 'var(--clr-primary)' : 'var(--clr-text-muted)',
              background: isActive ? 'var(--clr-primary-dim)' : 'transparent',
              transition: 'all var(--transition)',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--clr-border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 'var(--radius-sm)',
          marginBottom: 4,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--clr-primary-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'var(--clr-primary)', fontWeight: 700,
          }}>
            {(user?.name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Usuário'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
          🚪 Sair
        </button>
      </div>
    </aside>
  );
}
