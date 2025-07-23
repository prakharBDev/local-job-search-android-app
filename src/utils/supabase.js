import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This file should be imported only once at the root of the app.

let supabaseUrl, supabaseAnonKey;

try {
  const Config = require('react-native-config').default;
  supabaseUrl = Config.SUPABASE_URL;
  supabaseAnonKey = Config.SUPABASE_ANON_KEY;
} catch (error) {
  console.warn('react-native-config not available, using fallback values');
}

supabaseUrl = supabaseUrl || 'https://bjooblmjpxjhetluckox.supabase.co';
supabaseAnonKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqb29ibG1qcHhqaGV0bHVja294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTQ5NjEsImV4cCI6MjA2NjE3MDk2MX0.y4-4RtuqvjzEp0GXIh0z8TSoc5BIIRsPx_4AgS-ozOs';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key in environment variables');
  throw new Error('Missing Supabase URL or Anon Key in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
