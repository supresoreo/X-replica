import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/apiConfig';

let authToken = null;

export const setApiAuthToken = (token) => {
  authToken = token || null;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const normalizeApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return `Cannot reach the API at ${API_BASE_URL}. Start your backend server and try again.`;
  }

  if (error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
