import React from 'react';

/* ===== MODAL ===== */
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ===== SPINNER ===== */
export function Spinner({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%',
      border: '3px solid var(--clr-border)', borderTopColor: 'var(--clr-primary)',
      animation: 'spin 0.7s linear infinite' }} />
  );
}

export function LoadingCenter() {
  return <div className="loading-center"><Spinner /></div>;
}

/* ===== CONFIRM DIALOG ===== */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirmar'}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner size={16} /> : 'Excluir'}
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--clr-text-muted)', fontSize: 14 }}>
        {message || 'Tem certeza? Esta ação não pode ser desfeita.'}
      </p>
    </Modal>
  );
}

/* ===== PAGINATION ===== */
export function Pagination({ page, total, onChange }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="pagination">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      {pages.map(p => (
        <button key={p} className={p === page ? 'active' : ''} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === total}>›</button>
    </div>
  );
}

/* ===== EMPTY STATE ===== */
export function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title || 'Nenhum item encontrado'}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

/* ===== STATUS BADGE ===== */
export function StatusBadge({ status }) {
  const map = {
    paid:    { label: 'Pago',     cls: 'badge-success' },
    pending: { label: 'Pendente', cls: 'badge-warning' },
    overdue: { label: 'Atrasado', cls: 'badge-danger'  },
  };
  const s = map[status?.toLowerCase()] || { label: status, cls: 'badge-default' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
