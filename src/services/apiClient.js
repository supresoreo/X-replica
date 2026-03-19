import axios from 'axios';
import { API_BASE_URL, API_BASE_URLS, REQUEST_TIMEOUT_MS } from '../config/apiConfig';

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

apiClient.interceptors.response.use(
  (response) => {
    // Stick to the last successful API host for faster future requests.
    if (response?.config?.baseURL && apiClient.defaults.baseURL !== response.config.baseURL) {
      apiClient.defaults.baseURL = response.config.baseURL;
    }

    return response;
  },
  async (error) => {
    const config = error?.config;
    const isNetworkError = error?.code === 'ERR_NETWORK' || error?.message === 'Network Error';

    if (!config || !isNetworkError) {
      return Promise.reject(error);
    }

    const currentBaseURL = config.baseURL || apiClient.defaults.baseURL || API_BASE_URL;
    const triedBaseURLs = config.__triedBaseURLs || [currentBaseURL];
    const nextBaseURL = API_BASE_URLS.find((candidate) => !triedBaseURLs.includes(candidate));

    if (!nextBaseURL) {
      return Promise.reject(error);
    }

    config.__triedBaseURLs = [...triedBaseURLs, nextBaseURL];
    config.baseURL = nextBaseURL;

    return apiClient.request(config);
  }
);

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
    return `Cannot reach the API. Tried: ${API_BASE_URLS.join(', ')}. Make sure backend is running on port 5000.`;
  }

  if (error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
