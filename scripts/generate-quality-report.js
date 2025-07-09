#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import our quality check modules
const {
  checkFileSizes,
  countLines,
  getFileType,
} = require('./check-file-sizes');
const {
  checkDuplicates,
  findDuplicateFunctions,
} = require('./check-duplicates');

class QualityReporter {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      scores: {},
      metrics: {},
      issues: [],
      recommendations: [],
    };
  }

  async generateReport() {
    console.log('📊 Generating comprehensive quality report...\n');

    // File size analysis
    await this.analyzeFileSizes();

    // Code duplication analysis
    await this.analyzeDuplication();

    // Test coverage analysis
    await this.analyzeTestCoverage();

    // TypeScript usage analysis
    await this.analyzeTypeScriptUsage();

    // Performance metrics
    await this.analyzePerformance();

    // Calculate overall score
    this.calculateOverallScore();

    // Generate recommendations
    this.generateRecommendations();

    // Write report files
    this.writeReports();

    console.log('✅ Quality report generated successfully\n');
  }

  async analyzeFileSizes() {
    console.log('📏 Analyzing file sizes...');

    const files = this.getAllSourceFiles();
    const oversizedFiles = [];
    const sizeCounts = {
      small: 0, // < 100 lines
      medium: 0, // 100-200 lines
      large: 0, // 200-300 lines
      xlarge: 0, // > 300 lines
    };

    files.forEach(file => {
      const lines = countLines(file);
      const type = getFileType(file);

      if (lines < 100) {
        sizeCounts.small++;
      } else if (lines < 200) {
        sizeCounts.medium++;
      } else if (lines < 300) {
        sizeCounts.large++;
      } else {
        sizeCounts.xlarge++;
        oversizedFiles.push({ file, lines, type });
      }
    });

    this.report.metrics.fileSizes = {
      total: files.length,
      distribution: sizeCounts,
      oversized: oversizedFiles.length,
    };

    // Score based on file size distribution
    const sizeScore = Math.max(0, 100 - oversizedFiles.length * 10);
    this.report.scores.fileSize = Math.min(100, sizeScore);

    if (oversizedFiles.length > 0) {
      this.report.issues.push({
        type: 'File Size',
        severity: 'high',
        count: oversizedFiles.length,
        description: `${oversizedFiles.length} files exceed recommended size limits`,
        files: oversizedFiles.map(f => f.file),
      });
    }
  }

  async analyzeDuplication() {
    console.log('🔍 Analyzing code duplication...');

    const files = this.getAllSourceFiles();
    const duplicateFunctions = findDuplicateFunctions(files);

    // Simple duplication metric: count similar line patterns
    const duplicateLines = this.countDuplicateLines(files);
    const totalLines = files.reduce((sum, file) => sum + countLines(file), 0);
    const duplicationPercentage = (duplicateLines / totalLines) * 100;

    this.report.metrics.duplication = {
      duplicateFunctions: duplicateFunctions.length,
      duplicateLines,
      totalLines,
      percentage: duplicationPercentage,
    };

    // Score based on duplication percentage
    const duplicationScore = Math.max(0, 100 - duplicationPercentage * 10);
    this.report.scores.duplication = Math.min(100, duplicationScore);

    if (duplicationPercentage > 5) {
      this.report.issues.push({
        type: 'Code Duplication',
        severity: 'medium',
        count: duplicateFunctions.length,
        description: `${duplicationPercentage.toFixed(
          1,
        )}% code duplication detected`,
        details: duplicateFunctions.slice(0, 5), // Show first 5 duplicates
      });
    }
  }

  async analyzeTestCoverage() {
    console.log('🧪 Analyzing test coverage...');

    try {
      // Run jest with coverage
      const coverage = execSync(
        'npm test -- --coverage --passWithNoTests --watchAll=false',
        { encoding: 'utf8', stdio: 'pipe' },
      );

      // Parse coverage from output (simplified)
      const coverageMatch = coverage.match(/All files\s+\|\s+(\d+(?:\.\d+)?)/);
      const coveragePercentage = coverageMatch
        ? parseFloat(coverageMatch[1])
        : 0;

      this.report.metrics.testCoverage = {
        percentage: coveragePercentage,
        hasTests: coveragePercentage > 0,
      };

      this.report.scores.testCoverage = coveragePercentage;

      if (coveragePercentage < 70) {
        this.report.issues.push({
          type: 'Test Coverage',
          severity: 'high',
          count: 1,
          description: `Low test coverage: ${coveragePercentage}%`,
          recommendation: 'Add more unit tests to reach 80% coverage',
        });
      }
    } catch (error) {
      console.log('⚠️  Could not analyze test coverage');
      this.report.metrics.testCoverage = { percentage: 0, hasTests: false };
      this.report.scores.testCoverage = 0;
    }
  }

  async analyzeTypeScriptUsage() {
    console.log('📝 Analyzing TypeScript usage...');

    const jsFiles = this.getAllSourceFiles().filter(
      f => f.endsWith('.js') || f.endsWith('.jsx'),
    );
    const tsFiles = this.getAllSourceFiles().filter(
      f => f.endsWith('.ts') || f.endsWith('.tsx'),
    );

    const total = jsFiles.length + tsFiles.length;
    const tsPercentage = total > 0 ? (tsFiles.length / total) * 100 : 0;

    this.report.metrics.typescript = {
      jsFiles: jsFiles.length,
      tsFiles: tsFiles.length,
      percentage: tsPercentage,
    };

    this.report.scores.typescript = tsPercentage;

    if (tsPercentage < 80) {
      this.report.issues.push({
        type: 'TypeScript Usage',
        severity: 'medium',
        count: jsFiles.length,
        description: `${jsFiles.length} files still use JavaScript instead of TypeScript`,
        recommendation:
          'Convert JavaScript files to TypeScript for better type safety',
      });
    }
  }

  async analyzePerformance() {
    console.log('⚡ Analyzing performance metrics...');

    const files = this.getAllSourceFiles();
    const performanceIssues = [];

    // Check for performance anti-patterns
    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');

        // Check for missing React.memo
        if (
          content.includes('const ') &&
          content.includes('= (') &&
          content.includes('React.') &&
          !content.includes('memo')
        ) {
          performanceIssues.push({
            file,
            issue: 'Missing React.memo optimization',
          });
        }

        // Check for inline styles
        if (content.match(/style=\{\{/g)) {
          performanceIssues.push({
            file,
            issue: 'Inline styles detected (use StyleSheet.create)',
          });
        }

        // Check for missing useMemo/useCallback
        if (
          content.includes('useState') &&
          !content.includes('useMemo') &&
          !content.includes('useCallback')
        ) {
          performanceIssues.push({
            file,
            issue: 'Consider using useMemo/useCallback for optimization',
          });
        }
      } catch (error) {
        // Skip files that can't be read
      }
    });

    this.report.metrics.performance = {
      totalIssues: performanceIssues.length,
      issues: performanceIssues.slice(0, 10), // Show first 10 issues
    };

    // Score based on performance issues
    const performanceScore = Math.max(0, 100 - performanceIssues.length * 5);
    this.report.scores.performance = Math.min(100, performanceScore);

    if (performanceIssues.length > 5) {
      this.report.issues.push({
        type: 'Performance',
        severity: 'medium',
        count: performanceIssues.length,
        description: `${performanceIssues.length} potential performance issues detected`,
        recommendation: 'Implement React performance optimizations',
      });
    }
  }

  calculateOverallScore() {
    const scores = this.report.scores;
    const weights = {
      fileSize: 0.2,
      duplication: 0.25,
      testCoverage: 0.3,
      typescript: 0.15,
      performance: 0.1,
    };

    const weightedScore = Object.entries(weights).reduce(
      (sum, [key, weight]) => {
        return sum + (scores[key] || 0) * weight;
      },
      0,
    );

    this.report.scores.overall = Math.round(weightedScore);
  }

  generateRecommendations() {
    const score = this.report.scores.overall;

    if (score < 60) {
      this.report.recommendations.push(
        'Critical: Major refactoring required',
        'Focus on reducing file sizes and code duplication',
        'Increase test coverage to at least 70%',
      );
    } else if (score < 80) {
      this.report.recommendations.push(
        'Good: Minor improvements needed',
        'Convert remaining JS files to TypeScript',
        'Add performance optimizations',
      );
    } else {
      this.report.recommendations.push(
        'Excellent: Maintain current quality standards',
        'Continue monitoring for regressions',
        'Consider advanced optimizations',
      );
    }
  }

  writeReports() {
    // Write JSON report
    fs.writeFileSync(
      'quality-report.json',
      JSON.stringify(this.report, null, 2),
    );

    // Write Markdown report
    const markdown = this.generateMarkdownReport();
    fs.writeFileSync('quality-report.md', markdown);

    // Write console summary
    this.printSummary();
  }

  generateMarkdownReport() {
    const { scores, metrics, issues, recommendations } = this.report;

    return `# 📊 Code Quality Report

## Overall Score: ${scores.overall}/100

${this.getScoreBadge(scores.overall)}

## Detailed Scores

| Metric | Score | Status |
|--------|-------|--------|
| File Size | ${scores.fileSize}/100 | ${this.getStatus(scores.fileSize)} |
| Code Duplication | ${scores.duplication}/100 | ${this.getStatus(
      scores.duplication,
    )} |
| Test Coverage | ${scores.testCoverage}/100 | ${this.getStatus(
      scores.testCoverage,
    )} |
| TypeScript Usage | ${scores.typescript}/100 | ${this.getStatus(
      scores.typescript,
    )} |
| Performance | ${scores.performance}/100 | ${this.getStatus(
      scores.performance,
    )} |

## Issues Found

${
  issues.length > 0
    ? issues
        .map(
          issue => `
### ${issue.type} (${issue.severity})
${issue.description}
${issue.recommendation ? `**Recommendation:** ${issue.recommendation}` : ''}
`,
        )
        .join('\n')
    : '✅ No issues found'
}

## Recommendations

${recommendations.map(rec => `- ${rec}`).join('\n')}

## Metrics Summary

- **Total Files:** ${metrics.fileSizes?.total || 0}
- **Oversized Files:** ${metrics.fileSizes?.oversized || 0}
- **Test Coverage:** ${metrics.testCoverage?.percentage || 0}%
- **TypeScript Usage:** ${metrics.typescript?.percentage || 0}%
- **Performance Issues:** ${metrics.performance?.totalIssues || 0}

---
*Generated on ${new Date().toLocaleString()}*`;
  }

  getScoreBadge(score) {
    if (score >= 90) {
      return '🟢 Excellent';
    }
    if (score >= 80) {
      return '🟡 Good';
    }
    if (score >= 60) {
      return '🟠 Needs Improvement';
    }
    return '🔴 Critical';
  }

  getStatus(score) {
    if (score >= 80) {
      return '✅ Good';
    }
    if (score >= 60) {
      return '⚠️ Warning';
    }
    return '❌ Critical';
  }

  printSummary() {
    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 CODE QUALITY REPORT SUMMARY');
    console.log('='.repeat(50));
    console.log(
      `Overall Score: ${this.report.scores.overall}/100 ${this.getScoreBadge(
        this.report.scores.overall,
      )}`,
    );
    console.log('\nDetailed Scores:');
    Object.entries(this.report.scores).forEach(([key, value]) => {
      if (key !== 'overall') {
        console.log(`  ${key}: ${value}/100`);
      }
    });
    console.log('\nIssues Found:');
    if (this.report.issues.length === 0) {
      console.log('  ✅ No issues found');
    } else {
      this.report.issues.forEach(issue => {
        console.log(
          `  ${issue.severity === 'high' ? '🔴' : '🟡'} ${issue.type}: ${
            issue.description
          }`,
        );
      });
    }
    console.log(`\n${'='.repeat(50)}`);
  }

  getAllSourceFiles() {
    const files = [];

    function walkDir(dir) {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (
          stat.isDirectory() &&
          !item.startsWith('.') &&
          item !== 'node_modules'
        ) {
          walkDir(fullPath);
        } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(item)) {
          files.push(fullPath);
        }
      });
    }

    walkDir('src');
    return files;
  }

  countDuplicateLines(files) {
    // Simplified duplicate line counting
    const lineHashes = new Map();
    let duplicateCount = 0;

    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 10);

        lines.forEach(line => {
          const hash = line.replace(/\s+/g, ' ');
          if (lineHashes.has(hash)) {
            duplicateCount++;
          } else {
            lineHashes.set(hash, true);
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });

    return duplicateCount;
  }
}

// Run if called directly
if (require.main === module) {
  const reporter = new QualityReporter();
  reporter.generateReport().catch(console.error);
}

module.exports = { QualityReporter };
