import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Topbar({ title }) {
  const { theme, toggle } = useTheme();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-w)',
      right: 0,
      height: 'var(--topbar-h)',
      background: 'var(--clr-surface)',
      borderBottom: '1px solid var(--clr-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 90,
    }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        fontWeight: 600,
      }}>{title}</h1>

      <button
        onClick={toggle}
        className="btn btn-secondary btn-sm"
        title="Alternar tema"
        style={{ fontSize: 16 }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
