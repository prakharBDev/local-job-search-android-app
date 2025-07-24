/**
 * Centralized Error Handling for API Operations
 * Provides user-friendly error messages and consistent error types
 */

export class ApiError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error codes and their user-friendly messages
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  AUTH_USER_NOT_FOUND: 'User not found. Please check your credentials.',
  AUTH_EMAIL_NOT_CONFIRMED: 'Please verify your email address before signing in.',
  AUTH_TOO_MANY_REQUESTS: 'Too many login attempts. Please try again later.',
  AUTH_WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
  
  // Network errors
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  NETWORK_TIMEOUT: 'Request timed out. Please try again.',
  NETWORK_OFFLINE: 'You appear to be offline. Please check your connection.',
  
  // Database errors
  DB_CONSTRAINT_VIOLATION: 'This information conflicts with existing data.',
  DB_FOREIGN_KEY_VIOLATION: 'Related data not found.',
  DB_UNIQUE_VIOLATION: 'This information already exists.',
  DB_NOT_NULL_VIOLATION: 'Required information is missing.',
  
  // Permission errors
  PERMISSION_DENIED: 'You don\'t have permission to perform this action.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'Access denied.',
  
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_FORMAT: 'Please check the format of your input.',
  
  // File upload errors
  FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'File type not supported. Please choose a different file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Generic errors
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  MAINTENANCE_MODE: 'System is under maintenance. Please try again later.',
};

/**
 * Map Supabase error codes to user-friendly messages
 */
export const SUPABASE_ERROR_MAP = {
  'PGRST116': ERROR_MESSAGES.AUTH_USER_NOT_FOUND,
  'PGRST301': ERROR_MESSAGES.DB_CONSTRAINT_VIOLATION,
  'PGRST302': ERROR_MESSAGES.DB_FOREIGN_KEY_VIOLATION,
  'PGRST303': ERROR_MESSAGES.DB_UNIQUE_VIOLATION,
  'PGRST304': ERROR_MESSAGES.DB_NOT_NULL_VIOLATION,
  'PGRST401': ERROR_MESSAGES.UNAUTHORIZED,
  'PGRST403': ERROR_MESSAGES.FORBIDDEN,
  'PGRST404': ERROR_MESSAGES.AUTH_USER_NOT_FOUND,
  'PGRST422': ERROR_MESSAGES.VALIDATION_ERROR,
  'PGRST500': ERROR_MESSAGES.SERVER_ERROR,
};

/**
 * Handle and normalize API errors
 * @param {Error} error - Original error
 * @param {string} context - Context where error occurred
 * @returns {ApiError} Normalized error with user-friendly message
 */
export const handleApiError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error);

  // If it's already an ApiError, return it
  if (error instanceof ApiError) {
    return error;
  }

  // Extract error details
  const code = error.code || error.status || 'UNKNOWN_ERROR';
  const message = error.message || '';
  const details = {
    context,
    originalError: error,
    timestamp: new Date().toISOString(),
  };

  // Get user-friendly message
  let userMessage = ERROR_MESSAGES.UNKNOWN_ERROR;

  // Check Supabase error map first
  if (SUPABASE_ERROR_MAP[code]) {
    userMessage = SUPABASE_ERROR_MAP[code];
  }
  // Check for specific error patterns
  else if (message.includes('network') || message.includes('fetch')) {
    userMessage = ERROR_MESSAGES.NETWORK_ERROR;
  }
  else if (message.includes('timeout')) {
    userMessage = ERROR_MESSAGES.NETWORK_TIMEOUT;
  }
  else if (message.includes('authentication') || message.includes('auth')) {
    userMessage = ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS;
  }
  else if (message.includes('validation')) {
    userMessage = ERROR_MESSAGES.VALIDATION_ERROR;
  }
  else if (message.includes('permission') || message.includes('forbidden')) {
    userMessage = ERROR_MESSAGES.PERMISSION_DENIED;
  }
  else if (message.includes('unique') || message.includes('duplicate')) {
    userMessage = ERROR_MESSAGES.DB_UNIQUE_VIOLATION;
  }
  else if (message.includes('constraint')) {
    userMessage = ERROR_MESSAGES.DB_CONSTRAINT_VIOLATION;
  }
  else if (message.includes('foreign key')) {
    userMessage = ERROR_MESSAGES.DB_FOREIGN_KEY_VIOLATION;
  }
  else if (message.includes('not null')) {
    userMessage = ERROR_MESSAGES.DB_NOT_NULL_VIOLATION;
  }

  return new ApiError(userMessage, code, details);
};

/**
 * Check if error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean} Whether error should be retried
 */
export const isRetryableError = (error) => {
  const nonRetryableCodes = [400, 401, 403, 404, 422];
  const nonRetryableMessages = [
    'validation',
    'authentication',
    'permission',
    'unique',
    'constraint',
    'not null',
    'foreign key'
  ];

  // Check error code
  if (error.code && nonRetryableCodes.includes(parseInt(error.code))) {
    return false;
  }

  // Check error message
  const message = error.message?.toLowerCase() || '';
  return !nonRetryableMessages.some(keyword => message.includes(keyword));
};

/**
 * Get error severity level for logging/monitoring
 * @param {Error} error - Error to analyze
 * @returns {string} Severity level ('low', 'medium', 'high', 'critical')
 */
export const getErrorSeverity = (error) => {
  const criticalCodes = [500, 502, 503, 504];
  const highCodes = [401, 403, 404];
  const mediumCodes = [400, 422];

  if (error.code && criticalCodes.includes(parseInt(error.code))) {
    return 'critical';
  }
  if (error.code && highCodes.includes(parseInt(error.code))) {
    return 'high';
  }
  if (error.code && mediumCodes.includes(parseInt(error.code))) {
    return 'medium';
  }

  return 'low';
};

/**
 * Log error with appropriate level
 * @param {Error} error - Error to log
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = '') => {
  const severity = getErrorSeverity(error);
  const logData = {
    message: error.message,
    code: error.code,
    context,
    timestamp: new Date().toISOString(),
    severity,
    stack: error.stack,
  };

  switch (severity) {
    case 'critical':
      console.error('🚨 CRITICAL ERROR:', logData);
      break;
    case 'high':
      console.error('❌ HIGH SEVERITY ERROR:', logData);
      break;
    case 'medium':
      console.warn('⚠️ MEDIUM SEVERITY ERROR:', logData);
      break;
    default:
      console.log('ℹ️ LOW SEVERITY ERROR:', logData);
  }
}; 