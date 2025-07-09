#!/usr/bin/env node

const fs = require('fs');

// Quality gate thresholds
const QUALITY_THRESHOLDS = {
  overall: 70, // Overall score must be >= 70
  fileSize: 60, // File size score must be >= 60
  duplication: 70, // Code duplication score must be >= 70
  testCoverage: 60, // Test coverage must be >= 60%
  typescript: 50, // TypeScript usage must be >= 50%
  performance: 60, // Performance score must be >= 60
};

function runQualityGate() {
  console.log('🚧 Running quality gate checks...\n');

  // Read quality report
  if (!fs.existsSync('quality-report.json')) {
    console.error(
      '❌ Quality report not found. Run generate-quality-report.js first.',
    );
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync('quality-report.json', 'utf8'));
  const { scores, issues } = report;

  const failures = [];
  const warnings = [];

  // Check each threshold
  Object.entries(QUALITY_THRESHOLDS).forEach(([metric, threshold]) => {
    const score = scores[metric] || 0;

    if (score < threshold) {
      failures.push({
        metric,
        score,
        threshold,
        gap: threshold - score,
      });
    } else if (score < threshold + 10) {
      warnings.push({
        metric,
        score,
        threshold,
        gap: threshold - score,
      });
    }
  });

  // Check for critical issues
  const criticalIssues = issues.filter(issue => issue.severity === 'high');

  // Print results
  console.log('📊 Quality Gate Results:');
  console.log('=' * 40);

  if (failures.length === 0 && criticalIssues.length === 0) {
    console.log('✅ All quality gates passed!');
    console.log(`Overall Score: ${scores.overall}/100`);

    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(warning => {
        console.log(
          `  ${warning.metric}: ${warning.score}/${warning.threshold} (needs ${warning.gap} more points)`,
        );
      });
    }

    console.log('\n🎉 Quality gate: PASSED');
    process.exit(0);
  } else {
    console.log('❌ Quality gate failures:');

    failures.forEach(failure => {
      console.log(
        `  ${failure.metric}: ${failure.score}/${failure.threshold} (needs ${failure.gap} more points)`,
      );
    });

    if (criticalIssues.length > 0) {
      console.log('\n🚨 Critical issues:');
      criticalIssues.forEach(issue => {
        console.log(`  ${issue.type}: ${issue.description}`);
      });
    }

    console.log('\n💡 Recommendations:');
    console.log('  1. Fix critical issues before merging');
    console.log('  2. Improve scores that are below thresholds');
    console.log('  3. Run npm run cleanup to auto-fix some issues');
    console.log('  4. See CODE_REVIEW_GUIDELINES.md for best practices');

    console.log('\n🚫 Quality gate: FAILED');

    // In CI/CD, fail the build
    if (process.env.CI) {
      process.exit(1);
    } else {
      // In local development, just warn
      console.log(
        '\n⚠️  Local development: Quality gate failed but not blocking',
      );
      process.exit(0);
    }
  }
}

// Run if called directly
if (require.main === module) {
  runQualityGate();
}

module.exports = { runQualityGate, QUALITY_THRESHOLDS };
