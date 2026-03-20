import { NativeModules, Platform } from 'react-native';

const unique = (values) => Array.from(new Set(values.filter(Boolean)));

const getMetroHost = () => {
	const scriptURL = NativeModules?.SourceCode?.scriptURL;
	if (!scriptURL || typeof scriptURL !== 'string') {
		return '';
	}

	const match = scriptURL.match(/^https?:\/\/([^/:]+)/i);
	return match?.[1] || '';
};

const buildHostCandidates = () => {
	const metroHost = getMetroHost();

	if (Platform.OS === 'android') {
		return unique([
			'10.0.2.2',
			'10.0.3.2',
			metroHost,
			'localhost',
			'127.0.0.1',
		]);
	}

	return unique([
		metroHost,
		'localhost',
		'127.0.0.1',
	]);
};

const API_HOST_CANDIDATES = buildHostCandidates();

export const API_BASE_URLS = API_HOST_CANDIDATES.map((host) => `http://${host}:5000/api`);
export const API_BASE_URL = API_BASE_URLS[0] || 'http://localhost:5000/api';
export const REQUEST_TIMEOUT_MS = 15000;
