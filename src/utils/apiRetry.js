/**
 * Retry utility with exponential backoff for API calls.
 * Ensures critical operations like account creation are resilient to temporary network failures.
 */

export const retryWithExponentialBackoff = async (
  operation,
  maxRetries = 5,
  initialDelayMs = 1000
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry if it's not a network or timeout error
      const isRetryableError =
        error?.code === 'ERR_NETWORK' ||
        error?.message === 'Network Error' ||
        error?.code === 'ECONNABORTED' ||
        error?.code === 'ECONNREFUSED' ||
        error?.code === 'ETIMEDOUT' ||
        (error?.response?.status >= 500 && error?.response?.status < 600) ||
        error?.message?.includes('timeout');

      if (!isRetryableError || attempt === maxRetries) {
        throw error;
      }

      // Calculate exponential backoff delay
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      // Add random jitter (±10%) to prevent thundering herd
      const jitteredDelay = delayMs * (0.9 + Math.random() * 0.2);

      await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
    }
  }

  throw lastError;
};
