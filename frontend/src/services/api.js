import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth service
export const authService = {
  register: (name, email, password) =>
    axios.post(`${API_URL}/auth/register`, { name, email, password }),
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),
  getCurrentUser: (token) =>
    axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Subscription service
export const subscriptionService = {
  getAllSubscriptions: (token) =>
    axios.get(`${API_URL}/subscriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createSubscription: (token, data) =>
    axios.post(`${API_URL}/subscriptions`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateSubscription: (token, subscriptionId, data) =>
    axios.put(`${API_URL}/subscriptions/${subscriptionId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  cancelSubscription: (token, subscriptionId) =>
    axios.delete(`${API_URL}/subscriptions/${subscriptionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getOrgSubscriptions: (token, organizationId) =>
    axios.get(`${API_URL}/subscriptions/org/${organizationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Organization service
export const organizationService = {
  getAllOrganizations: (token) =>
    axios.get(`${API_URL}/organizations`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createOrganization: (token, data) =>
    axios.post(`${API_URL}/organizations`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getOrganization: (token, organizationId) =>
    axios.get(`${API_URL}/organizations/${organizationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateOrganization: (token, organizationId, data) =>
    axios.put(`${API_URL}/organizations/${organizationId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  addUserToOrganization: (token, organizationId, userId) =>
    axios.post(
      `${API_URL}/organizations/${organizationId}/users`,
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  removeUserFromOrganization: (token, organizationId, userId) =>
    axios.delete(`${API_URL}/organizations/${organizationId}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// User management service
export const userService = {
  getPendingUsers: (token) =>
    axios.get(`${API_URL}/users/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getAllUsers: (token) =>
    axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  approveUser: (token, userId) =>
    axios.post(
      `${API_URL}/users/${userId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  rejectUser: (token, userId) =>
    axios.post(
      `${API_URL}/users/${userId}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  changeUserRole: (token, userId, role) =>
    axios.post(
      `${API_URL}/users/${userId}/role`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  deactivateUser: (token, userId) =>
    axios.post(
      `${API_URL}/users/${userId}/deactivate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  reactivateUser: (token, userId) =>
    axios.post(
      `${API_URL}/users/${userId}/reactivate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  deleteUser: (token, userId) =>
    axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
