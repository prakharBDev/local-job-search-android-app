import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Debug utility for release builds
 * Stores errors and logs in AsyncStorage for debugging
 */
class DebugUtils {
  /**
   * Log an error for debugging in release builds
   */
  static async logError(context, action, error, additionalData = {}) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        context,
        action,
        error: error?.message || String(error),
        stack: error?.stack,
        ...additionalData,
      };
      
      await AsyncStorage.setItem('last_error', JSON.stringify(errorLog));
      
      // Keep last 5 errors
      const existingErrors = await AsyncStorage.getItem('error_history');
      const errorHistory = existingErrors ? JSON.parse(existingErrors) : [];
      errorHistory.push(errorLog);
      
      if (errorHistory.length > 5) {
        errorHistory.shift();
      }
      
      await AsyncStorage.setItem('error_history', JSON.stringify(errorHistory));
    } catch (storageError) {
      // Ignore storage errors
    }
  }

  /**
   * Get the last error for debugging
   */
  static async getLastError() {
    try {
      const errorData = await AsyncStorage.getItem('last_error');
      return errorData ? JSON.parse(errorData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get error history
   */
  static async getErrorHistory() {
    try {
      const errorData = await AsyncStorage.getItem('error_history');
      return errorData ? JSON.parse(errorData) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear all debug data
   */
  static async clearDebugData() {
    try {
      await AsyncStorage.multiRemove(['last_error', 'error_history']);
    } catch {
      // Ignore errors
    }
  }
}

export default DebugUtils; 