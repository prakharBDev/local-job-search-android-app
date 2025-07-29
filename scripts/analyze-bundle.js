#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzeBundle() {
  const bundlePath = path.join(__dirname, '../android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle');
  
  if (!fs.existsSync(bundlePath)) {
    console.log('❌ Bundle file not found. Run a release build first.');
    return;
  }

  const stats = fs.statSync(bundlePath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('📦 Bundle Analysis');
  console.log('==================');
  console.log(`Bundle size: ${sizeInMB} MB`);
  
  // Read bundle content for analysis
  const bundleContent = fs.readFileSync(bundlePath, 'utf8');
  
  // Analyze imports
  const reactImports = (bundleContent.match(/require\(['"]react['"]\)/g) || []).length;
  const reactNativeImports = (bundleContent.match(/require\(['"]react-native['"]\)/g) || []).length;
  const supabaseImports = (bundleContent.match(/require\(['"]@supabase\/supabase-js['"]\)/g) || []).length;
  const navigationImports = (bundleContent.match(/require\(['"]@react-navigation/g) || []).length;
  
  console.log('\n📊 Import Analysis:');
  console.log(`React imports: ${reactImports}`);
  console.log(`React Native imports: ${reactNativeImports}`);
  console.log(`Supabase imports: ${supabaseImports}`);
  console.log(`Navigation imports: ${navigationImports}`);
  
  // Check for large dependencies
  const largeDeps = [
    'styled-components',
    'react-native-vector-icons',
    'react-native-linear-gradient',
    '@react-native-google-signin/google-signin'
  ];
  
  console.log('\n🔍 Large Dependencies Check:');
  largeDeps.forEach(dep => {
    const count = (bundleContent.match(new RegExp(dep, 'g')) || []).length;
    if (count > 0) {
      console.log(`✅ ${dep}: ${count} references`);
    }
  });
  
  // Size recommendations
  console.log('\n💡 Size Optimization Recommendations:');
  if (sizeInMB > 10) {
    console.log('⚠️  Bundle is large. Consider:');
    console.log('   - Enable Hermes (already enabled)');
    console.log('   - Use dynamic imports for heavy components');
    console.log('   - Remove unused dependencies');
    console.log('   - Optimize images and assets');
  } else {
    console.log('✅ Bundle size is reasonable');
  }
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle }; 