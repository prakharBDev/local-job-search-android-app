#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Conventional commit types
const VALID_TYPES = [
  'feat', // New feature
  'fix', // Bug fix
  'docs', // Documentation
  'style', // Code style changes
  'refactor', // Code refactoring
  'test', // Tests
  'chore', // Maintenance
  'perf', // Performance improvements
  'ci', // CI/CD changes
  'build', // Build system changes
  'revert', // Revert previous commit
];

// Commit message validation rules
const COMMIT_RULES = {
  minLength: 10,
  maxLength: 100,
  requireType: true,
  requireScope: false,
  requireDescription: true,
};

function validateCommitMessage(commitMsgFile) {
  const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

  console.log('📝 Validating commit message format...\n');
  console.log(`Message: "${commitMsg}"\n`);

  const errors = [];

  // Check length
  if (commitMsg.length < COMMIT_RULES.minLength) {
    errors.push(
      `Commit message too short (${commitMsg.length}/${COMMIT_RULES.minLength})`,
    );
  }

  if (commitMsg.length > COMMIT_RULES.maxLength) {
    errors.push(
      `Commit message too long (${commitMsg.length}/${COMMIT_RULES.maxLength})`,
    );
  }

  // Check conventional commit format: type(scope): description
  const conventionalPattern =
    /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([^)]+\))?: .+/;

  if (!conventionalPattern.test(commitMsg)) {
    errors.push('Commit message does not follow conventional format');
    errors.push('Expected format: type(scope): description');
    errors.push(`Valid types: ${VALID_TYPES.join(', ')}`);
  } else {
    // Extract type and validate
    const typeMatch = commitMsg.match(/^(\w+)/);
    if (typeMatch && !VALID_TYPES.includes(typeMatch[1])) {
      errors.push(`Invalid commit type: ${typeMatch[1]}`);
      errors.push(`Valid types: ${VALID_TYPES.join(', ')}`);
    }
  }

  // Check for imperative mood (starts with verb)
  const descriptionMatch = commitMsg.match(/^[^:]+:\s*(.+)/);
  if (descriptionMatch) {
    const description = descriptionMatch[1];
    const firstWord = description.split(' ')[0].toLowerCase();

    const nonImperativeWords = [
      'added',
      'adding',
      'fixed',
      'fixing',
      'updated',
      'updating',
      'changed',
      'changing',
    ];
    if (nonImperativeWords.includes(firstWord)) {
      errors.push(
        'Use imperative mood in description (e.g., "add" not "added")',
      );
    }
  }

  // Check for uppercase first letter in description
  if (descriptionMatch) {
    const description = descriptionMatch[1];
    if (description[0] !== description[0].toLowerCase()) {
      errors.push('Description should start with lowercase letter');
    }
  }

  // Check for trailing period
  if (commitMsg.endsWith('.')) {
    errors.push('Remove trailing period from commit message');
  }

  if (errors.length > 0) {
    console.log('❌ Commit message validation failed:\n');
    errors.forEach(error => console.log(`  • ${error}`));
    console.log('\n📖 Examples of valid commit messages:');
    console.log('  • feat: add user authentication');
    console.log('  • fix: resolve navigation memory leak');
    console.log('  • refactor(components): optimize button performance');
    console.log('  • docs: update API documentation');
    console.log('  • test: add unit tests for user service');
    console.log('\nSee CODE_REVIEW_GUIDELINES.md for more details.\n');
    process.exit(1);
  }

  console.log('✅ Commit message is valid\n');
}

// Run if called directly
if (require.main === module) {
  const commitMsgFile = process.argv[2];
  if (!commitMsgFile) {
    console.error('Usage: node validate-commit-msg.js <commit-msg-file>');
    process.exit(1);
  }

  validateCommitMessage(commitMsgFile);
}

module.exports = { validateCommitMessage };
