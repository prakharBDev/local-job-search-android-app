#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('🔧 Setting up environment variables...\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log(
    '   If you need to update your environment variables, edit the .env file manually.\n',
  );
} else {
  // Create .env.example if it doesn't exist
  if (!fs.existsSync(envExamplePath)) {
    const envExampleContent = `# Supabase Configuration
# Copy this file to .env and fill in your actual values
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
`;

    fs.writeFileSync(envExamplePath, envExampleContent);
    console.log('✅ Created .env.example file');
  }

  // Create .env file
  const envContent = `# Supabase Configuration
# Replace these values with your actual Supabase credentials
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
  console.log(
    '📝 Please edit the .env file with your actual Supabase credentials\n',
  );
}

console.log('📋 Next steps:');
console.log(
  '1. Get your Supabase URL and anon key from your Supabase project dashboard',
);
console.log('2. Edit the .env file and replace the placeholder values');
console.log("3. Restart your development server if it's running");
console.log('4. Run the app with: npm run android or npm run ios\n');

console.log('🔗 Supabase Dashboard: https://app.supabase.com/');
console.log(
  '📚 Documentation: https://supabase.com/docs/guides/getting-started',
);
