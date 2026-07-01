import api from './api';

export const dashboardService = {
  getTotalExpenses:    () => api.get('/dashboard/total-expenses'),
  getExpensesCount:    () => api.get('/dashboard/expenses-count'),
  getExpensesByCategory: () => api.get('/dashboard/expenses-by-category'),
};
