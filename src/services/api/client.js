import { supabase } from '../../utils/supabase';
import { InteractionManager } from 'react-native';

/**
 * Centralized API Client for Supabase operations
 * Follows React Native performance best practices
 */
class ApiClient {
  constructor() {
    this.supabase = supabase;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Centralized request handler with error handling and retry logic
   * @param {Function} operation - Supabase operation to execute
   * @param {Object} options - Request options
   * @returns {Promise<{data: any, error: Error|null}>}
   */
  async request(operation, options = {}) {
    const { 
      retry = true, 
      cache = false, 
      cacheKey = null,
      defer = false,
      ...operationOptions 
    } = options;

    try {
      // Check cache first if enabled
      if (cache && cacheKey && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return { data: cached.data, error: null };
        }
        this.cache.delete(cacheKey);
      }

      // Execute operation with retry logic
      let lastError;
      for (let attempt = 1; attempt <= (retry ? this.retryAttempts : 1); attempt++) {
        try {
          const result = await operation(this.supabase, operationOptions);
          
          // Cache result if enabled
          if (cache && cacheKey && result.data) {
            this.cache.set(cacheKey, {
              data: result.data,
              timestamp: Date.now()
            });
          }

          return result;
        } catch (error) {
          lastError = error;
          
          // Don't retry on certain errors
          if (this.shouldNotRetry(error)) {
            break;
          }

          // Wait before retry (exponential backoff)
          if (attempt < this.retryAttempts) {
            await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
          }
        }
      }

      throw lastError;
    } catch (error) {
      return { data: null, error: this.normalizeError(error) };
    }
  }

  /**
   * Execute operation after interactions complete (performance optimization)
   * @param {Function} operation - Operation to execute
   * @param {Object} options - Request options
   */
  async requestAfterInteractions(operation, options = {}) {
    return new Promise((resolve) => {
      InteractionManager.runAfterInteractions(async () => {
        const result = await this.request(operation, { ...options, defer: true });
        resolve(result);
      });
    });
  }

  /**
   * Standardized query builder for common patterns
   * @param {string} table - Table name
   * @param {Object} options - Query options
   * @returns {Promise<{data: any, error: Error|null}>}
   */
  async query(table, options = {}) {
    const {
      select = '*',
      filters = {},
      orderBy = null,
      limit = null,
      offset = null,
      cache = true,
      cacheKey = null,
      single = false,
      ...otherOptions
    } = options;

    const operation = async (supabase) => {
      let query = supabase.from(table).select(select);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && value.operator) {
            query = query[value.operator](key, value.value);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending !== false });
      }

      // Apply pagination
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 100) - 1);
      }

      // Return single object if requested
      if (single) {
        return await query.single();
      }

      return await query;
    };

    const finalCacheKey = cacheKey || `${table}_${JSON.stringify(options)}`;
    return this.request(operation, { cache, cacheKey: finalCacheKey, ...otherOptions });
  }

  /**
   * Clear cache for specific key or all cache
   * @param {string} key - Cache key to clear (optional)
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Determine if error should not be retried
   * @param {Error} error - Error to check
   * @returns {boolean}
   */
  shouldNotRetry(error) {
    // Don't retry authentication errors, validation errors, or 4xx errors
    const nonRetryableCodes = [400, 401, 403, 404, 422];
    return nonRetryableCodes.includes(error.code) || 
           error.message?.includes('validation') ||
           error.message?.includes('authentication');
  }

  /**
   * Normalize error for consistent handling
   * @param {Error} error - Error to normalize
   * @returns {Error}
   */
  normalizeError(error) {
    // Add context and user-friendly messages
    const normalizedError = new Error(error.message || 'An unexpected error occurred');
    normalizedError.code = error.code;
    normalizedError.details = error.details;
    normalizedError.hint = error.hint;
    normalizedError.originalError = error;
    
    return normalizedError;
  }

  /**
   * Delay utility for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const apiClient = new ApiClient(); 