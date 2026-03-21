import { apiClient } from './apiClient';
import { retryWithExponentialBackoff } from '../utils/apiRetry';

const parseAuthResponse = (response) => {
  const payload = response.data || {};

  return {
    token: payload.token || payload.accessToken,
    user: payload.user || payload.data?.user || payload.profile,
  };
};

export const authService = {
  login: async ({ email, password }) => {
    const response = await retryWithExponentialBackoff(
      () => apiClient.post('/auth/login', { email, password }),
      5, // max 5 retries
      1000 // initial delay 1s
    );
    return parseAuthResponse(response);
  },

  register: async ({ fullName, username, email, birthday, password }) => {
    const response = await retryWithExponentialBackoff(
      () => apiClient.post('/auth/register', {
        name: fullName,
        fullName,
        displayName: fullName,
        username,
        handle: username,
        userName: username,
        email,
        birthday,
        birthDate: birthday,
        dateOfBirth: birthday,
        password,
      }),
      5, // max 5 retries
      1000 // initial delay 1s
    );
    return parseAuthResponse(response);
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data?.user || response.data?.data?.user || response.data;
  },

  searchUsers: async (query) => {
    const response = await apiClient.get('/users', {
      params: { q: query },
    });
    return response.data?.users || [];
  },
};
