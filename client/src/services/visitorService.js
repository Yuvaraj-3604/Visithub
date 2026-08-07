import API from './api.js';

const visitorService = {
  // Visitors
  registerVisitor: async (visitorData) => {
    const response = await API.post('/visitors', visitorData);
    return response.data;
  },

  getVisitors: async (filters = {}) => {
    const response = await API.get('/visitors', { params: filters });
    return response.data;
  },

  getVisitorById: async (id) => {
    const response = await API.get(`/visitors/${id}`);
    return response.data;
  },

  approveRejectVisitor: async (id, action, remarks) => {
    const response = await API.put(`/visitors/${id}/approve-reject`, { action, remarks });
    return response.data;
  },

  checkInVisitor: async (id) => {
    const response = await API.put(`/visitors/${id}/check-in`);
    return response.data;
  },

  checkOutVisitor: async (id) => {
    const response = await API.put(`/visitors/${id}/check-out`);
    return response.data;
  },

  cancelVisitor: async (id) => {
    const response = await API.put(`/visitors/${id}/cancel`);
    return response.data;
  },

  // Employees (Admin and Receptionist)
  getEmployees: async (filters = {}) => {
    const response = await API.get('/employees', { params: filters });
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await API.post('/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await API.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await API.delete(`/employees/${id}`);
    return response.data;
  },

  // User accounts (Admin only)
  getUsers: async () => {
    const response = await API.get('/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await API.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },

  // Reports & Dashboards
  getDashboardStats: async () => {
    const response = await API.get('/reports/dashboard');
    return response.data;
  },

  getSummaryReport: async (filters = {}) => {
    const response = await API.get('/reports/summary', { params: filters });
    return response.data;
  },

  // Activities (Audit Trail)
  getActivities: async (filters = {}) => {
    const response = await API.get('/activities', { params: filters });
    return response.data;
  },
};

export default visitorService;
