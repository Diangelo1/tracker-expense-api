import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../../components/common';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (isRegister && !form.name.trim()) e.name = 'Nome obrigatório.';
    if (!form.email.trim()) e.email = 'E-mail obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido.';
    if (!form.password) e.password = 'Senha obrigatória.';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isRegister) {
      const res = await register(form.name, form.email, form.password);
      if (res.success) {
        toast.success('Conta criada! Faça login.');
        setIsRegister(false);
        setForm({ name: '', email: form.email, password: '' });
      } else {
        toast.error(res.message);
      }
    } else {
      const res = await login(form.email, form.password);
      if (res.success) { navigate('/'); }
      else { toast.error(res.message); }
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--clr-bg)', padding: 16,
    }}>
      {/* BG accent */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--clr-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(108,99,255,0.4)',
          }}>💰</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Money Flow</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginTop: 4 }}>
            {isRegister ? 'Crie sua conta gratuitamente' : 'Bem-vindo de volta!'}
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Seu nome completo"
                  value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input className={`form-input ${errors.email ? 'error' : ''}`}
                type="email" placeholder="seu@email.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input className={`form-input ${errors.password ? 'error' : ''}`}
                type="password" placeholder="••••••••"
                value={form.password} onChange={e => set('password', e.target.value)} />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ marginTop: 8, justifyContent: 'center', padding: '13px 20px', fontSize: 15 }}>
              {loading ? <Spinner size={18} /> : (isRegister ? '🚀 Criar conta' : '→ Entrar')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--clr-text-muted)' }}>
            {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
            <button onClick={() => { setIsRegister(r => !r); setErrors({}); }}
              style={{ color: 'var(--clr-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              {isRegister ? 'Entrar' : 'Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
