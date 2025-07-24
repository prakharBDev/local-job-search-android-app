import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEnvironment } from '../config/env';

// This file should be imported only once at the root of the app.

// Validate and get environment variables
const { url: supabaseUrl, anonKey: supabaseAnonKey } = validateEnvironment();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
