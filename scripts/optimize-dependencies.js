#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzeDependencies() {
  console.log('🔍 Dependency Analysis for APK Size Optimization');
  console.log('================================================');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies;
  
  // Large dependencies that significantly impact APK size
  const largeDeps = {
    'react-native-vector-icons': '~5-8MB (icon fonts)',
    'styled-components': '~2-3MB (CSS-in-JS runtime)',
    '@supabase/supabase-js': '~3-5MB (database client)',
    'react-native-linear-gradient': '~1-2MB (native module)',
    '@react-native-google-signin/google-signin': '~2-3MB (Google services)',
    'react-native-screens': '~1-2MB (native navigation)'
  };
  
  console.log('\n📦 Large Dependencies Analysis:');
  Object.entries(largeDeps).forEach(([dep, size]) => {
    if (dependencies[dep]) {
      console.log(`⚠️  ${dep}: ${size}`);
    }
  });
  
  console.log('\n💡 Optimization Recommendations:');
  console.log('1. Vector Icons:');
  console.log('   - Use only specific icon families instead of all');
  console.log('   - Consider using React Native SVG for custom icons');
  console.log('   - Remove unused icon families');
  
  console.log('\n2. Styled Components:');
  console.log('   - Consider using StyleSheet for simple styles');
  console.log('   - Use theme variables to reduce bundle size');
  console.log('   - Enable tree shaking in babel config');
  
  console.log('\n3. Supabase:');
  console.log('   - Use specific imports instead of full client');
  console.log('   - Consider code splitting for database operations');
  
  console.log('\n4. Google Sign In:');
  console.log('   - Only include if absolutely necessary');
  console.log('   - Consider alternative auth methods');
  
  console.log('\n5. General:');
  console.log('   - Use dynamic imports for heavy components');
  console.log('   - Implement code splitting');
  console.log('   - Remove unused dependencies');
}

if (require.main === module) {
  analyzeDependencies();
}

module.exports = { analyzeDependencies }; 