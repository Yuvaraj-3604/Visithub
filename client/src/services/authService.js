import API from './api.js';

const authService = {
  login: async (username, password, portalRole) => {
    const response = await API.post('/auth/login', { username, password, portalRole });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  fetchProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  },
};

export default authService;
