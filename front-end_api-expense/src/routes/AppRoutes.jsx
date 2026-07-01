import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage     from '../pages/Auth/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import CategoriesPage from '../pages/Categories/CategoriesPage';
import ExpensesPage  from '../pages/Expenses/ExpensesPage';
import Sidebar       from '../components/layout/Sidebar';

function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />

      <Route path="/" element={
        <Protected>
          <AppLayout><DashboardPage /></AppLayout>
        </Protected>
      } />

      <Route path="/categories" element={
        <Protected>
          <AppLayout><CategoriesPage /></AppLayout>
        </Protected>
      } />

      <Route path="/expenses" element={
        <Protected>
          <AppLayout><ExpensesPage /></AppLayout>
        </Protected>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
