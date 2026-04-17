import axios from 'axios';

const API = axios.create({
  baseURL: 'https://banking-website-production.up.railway.app/'
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('gvb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/me');

// Accounts
export const getAccounts = () => API.get('/accounts');
export const createAccount = (data) => API.post('/accounts', data);

// Transactions
export const depositMoney = (data) => API.post('/transactions/deposit', data);
export const withdrawMoney = (data) => API.post('/transactions/withdraw', data);
export const transferMoney = (data) => API.post('/transactions/transfer', data);
export const getTransactionHistory = (params) => API.get('/transactions/history', { params });

export default API;
