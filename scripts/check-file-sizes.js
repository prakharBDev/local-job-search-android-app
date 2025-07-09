#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// File size limits (in lines)
const SIZE_LIMITS = {
  components: 200,
  screens: 300,
  contexts: 200,
  utils: 150,
  services: 200,
  default: 250,
};

// Get file type based on path
function getFileType(filePath) {
  if (filePath.includes('/components/')) {
    return 'components';
  }
  if (filePath.includes('/screens/')) {
    return 'screens';
  }
  if (filePath.includes('/contexts/')) {
    return 'contexts';
  }
  if (filePath.includes('/utils/')) {
    return 'utils';
  }
  if (filePath.includes('/services/')) {
    return 'services';
  }
  return 'default';
}

// Count lines in a file
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

// Get staged files
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=AM', {
      encoding: 'utf8',
    });
    return output
      .trim()
      .split('\n')
      .filter(
        file =>
          file.match(/\.(js|jsx|ts|tsx)$/) && !file.includes('node_modules'),
      );
  } catch (error) {
    console.log('No staged files found');
    return [];
  }
}

// Main function
function checkFileSizes() {
  const stagedFiles = getStagedFiles();
  const oversizedFiles = [];

  console.log('📊 Checking file sizes...\n');

  stagedFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      return;
    }

    const lineCount = countLines(fullPath);
    const fileType = getFileType(file);
    const limit = SIZE_LIMITS[fileType];

    if (lineCount > limit) {
      oversizedFiles.push({
        file,
        lines: lineCount,
        limit,
        type: fileType,
      });
    }
  });

  if (oversizedFiles.length > 0) {
    console.log('❌ The following files exceed size limits:\n');
    oversizedFiles.forEach(({ file, lines, limit, type }) => {
      console.log(`  ${file}`);
      console.log(`    Lines: ${lines}/${limit} (${type})`);
      console.log('    Recommendation: Break into smaller components\n');
    });

    console.log('Please refactor these files before committing.');
    console.log('See CODE_REVIEW_GUIDELINES.md for best practices.\n');
    process.exit(1);
  }

  console.log('✅ All files are within size limits\n');
}

// Run if called directly
if (require.main === module) {
  checkFileSizes();
}

module.exports = { checkFileSizes, countLines, getFileType };
