import Config from 'react-native-config';

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: Config.SUPABASE_URL,
  anonKey: Config.SUPABASE_ANON_KEY,
};

// Validate required environment variables
export const validateEnvironment = () => {
  const missingVars = [];

  if (!SUPABASE_CONFIG.url) {
    missingVars.push('SUPABASE_URL');
  }

  if (!SUPABASE_CONFIG.anonKey) {
    missingVars.push('SUPABASE_ANON_KEY');
  }

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
    console.error(
      'Please create a .env file in the project root with the following variables:',
    );
    console.error('SUPABASE_URL=your_supabase_url_here');
    console.error('SUPABASE_ANON_KEY=your_supabase_anon_key_here');
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  return SUPABASE_CONFIG;
};
