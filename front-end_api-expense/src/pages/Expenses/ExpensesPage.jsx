import React, { useState, useEffect, useCallback } from 'react';
import { expensesService } from '../../services/expensesService';
import { categoriesService } from '../../services/categoriesService';
import { Modal, ConfirmDialog, LoadingCenter, EmptyState, Pagination, StatusBadge } from '../../components/common';
import { usePagination, useDebounce } from '../../hooks';
import Topbar from '../../components/layout/Topbar';
import toast from 'react-hot-toast';

const EMPTY_FORM = { description: '', amount: '', categoryId: '', status: 'pending', date: '' };
const STATUS_OPTIONS = ['pending', 'paid', 'overdue'];

function formatCurrency(v) {
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ExpensesPage() {
  const [items, setItems]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [modal, setModal]         = useState({ open: false, item: null });
  const [confirm, setConfirm]     = useState({ open: false, id: null });
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});

  // Filters
  const [filters, setFilters] = useState({ search: '', categoryId: '', status: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '' });
  const debouncedSearch = useDebounce(filters.search);

  const filtered = items.filter(i => {
    const txt = (i.description || i.title || '').toLowerCase();
    if (debouncedSearch && !txt.includes(debouncedSearch.toLowerCase())) return false;
    if (filters.categoryId && String(i.categoryId || i.category?.id) !== filters.categoryId) return false;
    if (filters.status && i.status !== filters.status) return false;
    if (filters.dateFrom && new Date(i.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo   && new Date(i.date) > new Date(filters.dateTo))   return false;
    if (filters.minAmount && parseFloat(i.amount) < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && parseFloat(i.amount) > parseFloat(filters.maxAmount)) return false;
    return true;
  });

  const { page, setPage, total, paginated, reset } = usePagination(filtered, 10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.allSettled([
        expensesService.getAll(),
        categoriesService.getAll(),
      ]);
      if (expRes.status === 'fulfilled') {
        const d = expRes.value.data;
        setItems(Array.isArray(d) ? d : d?.expenses || d?.data || []);
      }
      if (catRes.status === 'fulfilled') {
        const d = catRes.value.data;
        setCategories(Array.isArray(d) ? d : d?.categories || d?.data || []);
      }
    } catch {
      toast.error('Erro ao carregar despesas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY_FORM); setErrors({}); setModal({ open: true, item: null }); };
  const openEdit   = (item) => {
    setForm({
      description: item.description || item.title || '',
      amount: item.amount || '',
      categoryId: item.categoryId || item.category?.id || '',
      status: item.status || 'pending',
      date: item.date ? item.date.slice(0, 10) : '',
    });
    setErrors({});
    setModal({ open: true, item });
  };
  const closeModal = () => setModal({ open: false, item: null });

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Descrição obrigatória.';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) e.amount = 'Valor deve ser maior que zero.';
    if (!form.categoryId) e.categoryId = 'Selecione uma categoria.';
    if (!form.date) e.date = 'Data obrigatória.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, amount: parseFloat(form.amount), categoryId: parseInt(form.categoryId) };
    try {
      if (modal.item) {
        await expensesService.update(modal.item.id, payload);
        toast.success('Despesa atualizada!');
      } else {
        await expensesService.create(payload);
        toast.success('Despesa criada!');
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await expensesService.delete(confirm.id);
      toast.success('Despesa excluída.');
      setConfirm({ open: false, id: null });
      load();
    } catch {
      toast.error('Erro ao excluir.');
    } finally {
      setDeleting(false);
    }
  };

  const setField = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); reset(); };
  const clearFilters = () => { setFilters({ search: '', categoryId: '', status: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '' }); reset(); };
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <Topbar title="Despesas" />
      <div className="page-body">
        <div className="page-header">
          <div>
            <h2 className="page-title">Despesas</h2>
            <p className="page-subtitle">{filtered.length} de {items.length} despesa{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Nova Despesa</button>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '2 1 200px' }}>
              <label className="form-label">Buscar</label>
              <input className="form-input" placeholder="🔍 Descrição..."
                value={filters.search} onChange={e => setFilter('search', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '1 1 140px' }}>
              <label className="form-label">Categoria</label>
              <select className="form-select" value={filters.categoryId} onChange={e => setFilter('categoryId', e.target.value)}>
                <option value="">Todas</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: '1 1 120px' }}>
              <label className="form-label">Status</label>
              <select className="form-select" value={filters.status} onChange={e => setFilter('status', e.target.value)}>
                <option value="">Todos</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'paid' ? 'Pago' : s === 'pending' ? 'Pendente' : 'Atrasado'}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: '1 1 130px' }}>
              <label className="form-label">De</label>
              <input className="form-input" type="date" value={filters.dateFrom} onChange={e => setFilter('dateFrom', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '1 1 130px' }}>
              <label className="form-label">Até</label>
              <input className="form-input" type="date" value={filters.dateTo} onChange={e => setFilter('dateTo', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '1 1 110px' }}>
              <label className="form-label">Valor mín.</label>
              <input className="form-input" type="number" placeholder="0" value={filters.minAmount} onChange={e => setFilter('minAmount', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '1 1 110px' }}>
              <label className="form-label">Valor máx.</label>
              <input className="form-input" type="number" placeholder="9999" value={filters.maxAmount} onChange={e => setFilter('maxAmount', e.target.value)} />
            </div>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ alignSelf: 'flex-end', marginBottom: 1 }}>
                ✕ Limpar
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? <LoadingCenter /> : (
          <>
            {paginated.length === 0 ? (
              <EmptyState icon="💳" title="Nenhuma despesa encontrada"
                message={hasFilters ? 'Tente ajustar os filtros.' : 'Cadastre sua primeira despesa.'}
                action={!hasFilters && <button className="btn btn-primary" onClick={openCreate}>+ Nova Despesa</button>} />
            ) : (
              <div className="card" style={{ padding: 0 }}>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th style={{ textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((exp) => (
                        <tr key={exp.id}>
                          <td style={{ color: 'var(--clr-text-muted)', width: 48 }}>{exp.id}</td>
                          <td style={{ fontWeight: 500 }}>{exp.description || exp.title || '—'}</td>
                          <td>
                            {exp.category?.name || exp.categoryName
                              ? <span className="badge badge-primary">{exp.category?.name || exp.categoryName}</span>
                              : <span style={{ color: 'var(--clr-text-muted)' }}>—</span>}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--clr-danger)' }}>{formatCurrency(exp.amount)}</td>
                          <td><StatusBadge status={exp.status} /></td>
                          <td style={{ color: 'var(--clr-text-muted)' }}>
                            {exp.date ? new Date(exp.date).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(exp)}>✏️</button>
                              <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ open: true, id: exp.id })}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <Pagination page={page} total={total} onChange={setPage} />
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modal.open} onClose={closeModal}
        title={modal.item ? 'Editar Despesa' : 'Nova Despesa'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando…' : (modal.item ? 'Salvar' : 'Criar')}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Descrição *</label>
          <input className={`form-input ${errors.description ? 'error' : ''}`}
            placeholder="Ex: Almoço" value={form.description} onChange={e => setField('description', e.target.value)} />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label className="form-label">Valor (R$) *</label>
            <input className={`form-input ${errors.amount ? 'error' : ''}`}
              type="number" step="0.01" min="0" placeholder="0,00"
              value={form.amount} onChange={e => setField('amount', e.target.value)} />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Data *</label>
            <input className={`form-input ${errors.date ? 'error' : ''}`}
              type="date" value={form.date} onChange={e => setField('date', e.target.value)} />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
        </div>

        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label className="form-label">Categoria *</label>
            <select className={`form-select ${errors.categoryId ? 'error' : ''}`}
              value={form.categoryId} onChange={e => setField('categoryId', e.target.value)}>
              <option value="">Selecionar…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => setField('status', e.target.value)}>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="overdue">Atrasado</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirm.open} onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete} loading={deleting}
        title="Excluir Despesa"
        message="Esta despesa será removida permanentemente. Deseja continuar?" />
    </>
  );
}
