#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to check for duplication
const DUPLICATE_PATTERNS = [
  {
    name: 'Similar component structures',
    pattern: /const\s+\w+\s*=\s*\(\s*\)\s*=>\s*\{/g,
    threshold: 3,
  },
  {
    name: 'Duplicate styling patterns',
    pattern: /StyleSheet\.create\(\{[\s\S]*?\}\)/g,
    threshold: 2,
  },
  {
    name: 'Similar hooks usage',
    pattern: /const\s+\[\w+,\s*\w+\]\s*=\s*useState\(/g,
    threshold: 5,
  },
  {
    name: 'Duplicate import statements',
    pattern: /import\s+.*\s+from\s+['"].*['"]/g,
    threshold: 10,
  },
];

// Get all TypeScript/JavaScript files
function getAllFiles(dir = 'src') {
  const files = [];

  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.')) {
        walkDir(fullPath);
      } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(item)) {
        files.push(fullPath);
      }
    });
  }

  walkDir(dir);
  return files;
}

// Check for code duplication
function checkDuplicates() {
  const files = getAllFiles();
  const duplicateIssues = [];

  console.log('🔍 Checking for duplicate code patterns...\n');

  // Check each pattern
  DUPLICATE_PATTERNS.forEach(({ name, pattern, threshold }) => {
    const matches = {};
    let totalMatches = 0;

    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fileMatches = content.match(pattern) || [];

        if (fileMatches.length > 0) {
          matches[file] = fileMatches.length;
          totalMatches += fileMatches.length;
        }
      } catch (error) {
        // Skip files that can't be read
      }
    });

    if (totalMatches > threshold) {
      duplicateIssues.push({
        name,
        totalMatches,
        threshold,
        files: matches,
      });
    }
  });

  // Check for exact duplicate functions
  const functionDuplicates = findDuplicateFunctions(files);
  if (functionDuplicates.length > 0) {
    duplicateIssues.push({
      name: 'Duplicate functions',
      duplicates: functionDuplicates,
    });
  }

  if (duplicateIssues.length > 0) {
    console.log('⚠️  Code duplication detected:\n');

    duplicateIssues.forEach(issue => {
      console.log(`  ${issue.name}:`);

      if (issue.files) {
        console.log(
          `    Total occurrences: ${issue.totalMatches}/${issue.threshold}`,
        );
        Object.entries(issue.files).forEach(([file, count]) => {
          console.log(`      ${file}: ${count} occurrences`);
        });
      }

      if (issue.duplicates) {
        issue.duplicates.forEach(dup => {
          console.log(`    Function "${dup.name}" found in:`);
          dup.files.forEach(file => console.log(`      ${file}`));
        });
      }

      console.log('');
    });

    console.log('Consider refactoring duplicate code into reusable utilities.');
    console.log('See CODE_REVIEW_GUIDELINES.md for best practices.\n');

    // Don't fail the commit for warnings, just notify
    console.log('⚠️  Duplicate code detected - consider refactoring\n');
  } else {
    console.log('✅ No significant code duplication found\n');
  }
}

// Find duplicate function definitions
function findDuplicateFunctions(files) {
  const functions = {};
  const duplicates = [];

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const functionMatches = content.match(/function\s+(\w+)\s*\(/g) || [];
      const arrowMatches =
        content.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g) || [];

      [...functionMatches, ...arrowMatches].forEach(match => {
        const name = match.match(/(?:function\s+|const\s+)(\w+)/)?.[1];
        if (name && name.length > 3) {
          // Skip very short function names
          if (!functions[name]) {
            functions[name] = [];
          }
          functions[name].push(file);
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
  });

  Object.entries(functions).forEach(([name, files]) => {
    if (files.length > 1) {
      duplicates.push({ name, files });
    }
  });

  return duplicates;
}

// Run if called directly
if (require.main === module) {
  checkDuplicates();
}

module.exports = { checkDuplicates, findDuplicateFunctions };
