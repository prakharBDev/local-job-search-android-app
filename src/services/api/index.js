/**
 * Centralized API Layer
 * Provides standardized access to all API operations
 */

// Core API client and utilities
export { apiClient } from './client';
export { 
  ApiError, 
  ERROR_MESSAGES, 
  SUPABASE_ERROR_MAP,
  handleApiError, 
  isRetryableError, 
  getErrorSeverity, 
  logError 
} from './errors';

// Query builders
export {
  buildJobQuery,
  buildProfileQuery,
  buildSeekerProfileQuery,
  buildCompanyProfileQuery,
  buildApplicationQuery,
  buildSearchQuery,
  buildDashboardStatsQuery,
  buildManyToManyQuery,
} from './queryBuilders';

// Re-export Supabase client for direct access when needed
export { supabase } from '../../utils/supabase'; 