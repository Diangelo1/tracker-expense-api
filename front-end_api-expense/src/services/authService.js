import api from './api';

export const authService = {
  register: (data) => api.post('/users', data),
  login: (data) => api.post('/auth/login', data),
};
