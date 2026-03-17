import { Platform } from 'react-native';

const API_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${API_HOST}:5000/api`;
export const REQUEST_TIMEOUT_MS = 15000;
