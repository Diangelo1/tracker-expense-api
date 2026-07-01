import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { expensesService } from '../../services/expensesService';
import { LoadingCenter, StatusBadge } from '../../components/common';
import Topbar from '../../components/layout/Topbar';
import toast from 'react-hot-toast';

const COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'];

function StatCard({ icon, label, value, sub, color = 'var(--clr-primary)' }) {
  return (
    <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: `${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--clr-text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function formatCurrency(v) {
  const n = parseFloat(v) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function DashboardPage() {
  const [stats, setStats]       = useState({ total: null, count: null, byCategory: [] });
  const [recent, setRecent]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [totalRes, countRes, catRes, expRes] = await Promise.allSettled([
          dashboardService.getTotalExpenses(),
          dashboardService.getExpensesCount(),
          dashboardService.getExpensesByCategory(),
          expensesService.getAll({ limit: 5 }),
        ]);

        const total   = totalRes.status === 'fulfilled'   ? totalRes.value.data   : null;
        const count   = countRes.status === 'fulfilled'   ? countRes.value.data   : null;
        const byCat   = catRes.status   === 'fulfilled'   ? catRes.value.data     : [];
        const expData = expRes.status   === 'fulfilled'   ? expRes.value.data     : [];

        setStats({ total, count, byCategory: Array.isArray(byCat) ? byCat : [] });
        setRecent(Array.isArray(expData) ? expData.slice(0, 5) : (expData?.expenses || expData?.data || []).slice(0, 5));
      } catch {
        toast.error('Erro ao carregar dashboard.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalValue = stats.total?.total || stats.total?.totalAmount || stats.total?.value || 0;
  const countValue = stats.count?.count || stats.count?.total || stats.count?.value || 0;

  const catData = stats.byCategory.map((c, i) => ({
    name: c.category || c.name || c.categoryName || `Cat ${i+1}`,
    value: parseFloat(c.total || c.amount || c.value || 0),
  })).filter(c => c.value > 0);

  if (loading) return (
    <>
      <Topbar title="Dashboard" />
      <div className="page-body"><LoadingCenter /></div>
    </>
  );

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="page-body">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard icon="💰" label="Total de Gastos" value={formatCurrency(totalValue)} color="var(--clr-primary)" />
          <StatCard icon="📋" label="Total de Despesas" value={countValue} sub="registros" color="var(--clr-success)" />
          <StatCard icon="🏷️" label="Categorias" value={catData.length} sub="ativas" color="var(--clr-warning)" />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Pie chart */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 20 }}>
              Gastos por Categoria
            </div>
            {catData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--clr-text-muted)', fontSize: 14 }}>
                Sem dados de categorias
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                    {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar chart */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 20 }}>
              Valor por Categoria
            </div>
            {catData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--clr-text-muted)', fontSize: 14 }}>
                Sem dados
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={catData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--clr-text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--clr-text-muted)' }} tickFormatter={v => `R$${v}`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="value" fill="var(--clr-primary)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent expenses */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 20 }}>
            Últimas Despesas
          </div>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--clr-text-muted)', fontSize: 14 }}>Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((e) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 500 }}>{e.description || e.title || e.name || '—'}</td>
                      <td><span className="badge badge-primary">{e.category?.name || e.categoryName || '—'}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--clr-danger)' }}>{formatCurrency(e.amount || e.value || 0)}</td>
                      <td><StatusBadge status={e.status} /></td>
                      <td style={{ color: 'var(--clr-text-muted)' }}>
                        {e.date ? new Date(e.date).toLocaleDateString('pt-BR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
