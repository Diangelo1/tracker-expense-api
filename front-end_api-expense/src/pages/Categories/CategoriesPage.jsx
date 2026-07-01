import React, { useState, useEffect } from 'react';
import { categoriesService } from '../../services/categoriesService';
import { Modal, ConfirmDialog, LoadingCenter, EmptyState, Pagination } from '../../components/common';
import { usePagination } from '../../hooks';
import Topbar from '../../components/layout/Topbar';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '' };

export default function CategoriesPage() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState({ open: false, item: null });
  const [confirm, setConfirm]   = useState({ open: false, id: null });
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.description?.toLowerCase().includes(search.toLowerCase())
  );
  const { page, setPage, total, paginated } = usePagination(filtered, 8);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await categoriesService.getAll();
      setItems(Array.isArray(data) ? data : data?.categories || data?.data || []);
    } catch {
      toast.error('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setErrors({}); setModal({ open: true, item: null }); };
  const openEdit   = (item) => { setForm({ name: item.name || '', description: item.description || '' }); setErrors({}); setModal({ open: true, item }); };
  const closeModal = () => setModal({ open: false, item: null });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nome obrigatório.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (modal.item) {
        await categoriesService.update(modal.item.id, form);
        toast.success('Categoria atualizada!');
      } else {
        await categoriesService.create(form);
        toast.success('Categoria criada!');
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
      await categoriesService.delete(confirm.id);
      toast.success('Categoria excluída.');
      setConfirm({ open: false, id: null });
      load();
    } catch {
      toast.error('Erro ao excluir.');
    } finally {
      setDeleting(false);
    }
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  return (
    <>
      <Topbar title="Categorias" />
      <div className="page-body">
        <div className="page-header">
          <div>
            <h2 className="page-title">Categorias</h2>
            <p className="page-subtitle">{items.length} categoria{items.length !== 1 ? 's' : ''} cadastrada{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Nova Categoria</button>
        </div>

        {/* Search */}
        <div className="filters-bar">
          <input className="form-input" placeholder="🔍  Buscar categorias..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ maxWidth: 320 }} />
        </div>

        {/* Table */}
        {loading ? <LoadingCenter /> : (
          <>
            {paginated.length === 0 ? (
              <EmptyState icon="🏷️" title="Nenhuma categoria encontrada"
                message={search ? 'Tente outro termo.' : 'Crie sua primeira categoria.'}
                action={!search && <button className="btn btn-primary" onClick={openCreate}>+ Nova Categoria</button>} />
            ) : (
              <div className="card" style={{ padding: 0 }}>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th style={{ textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((cat) => (
                        <tr key={cat.id}>
                          <td style={{ color: 'var(--clr-text-muted)', width: 48 }}>{cat.id}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: 'var(--clr-primary-dim)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, color: 'var(--clr-primary)', fontWeight: 700,
                              }}>
                                {(cat.name || '?')[0].toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500 }}>{cat.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--clr-text-muted)' }}>{cat.description || '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(cat)}>✏️ Editar</button>
                              <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ open: true, id: cat.id })}>🗑️</button>
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
        title={modal.item ? 'Editar Categoria' : 'Nova Categoria'}
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
          <label className="form-label">Nome *</label>
          <input className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Ex: Alimentação" value={form.name} onChange={e => set('name', e.target.value)} />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Descrição</label>
          <input className="form-input" placeholder="Descrição opcional"
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
      </Modal>

      <ConfirmDialog open={confirm.open} onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete} loading={deleting}
        title="Excluir Categoria"
        message="Excluir esta categoria pode afetar despesas vinculadas. Deseja continuar?" />
    </>
  );
}
