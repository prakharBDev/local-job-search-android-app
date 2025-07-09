#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Documentation Generator
 * Automatically generates and updates project documentation
 */

class DocumentationGenerator {
  constructor() {
    this.projectRoot = process.cwd();
    this.docsDir = path.join(this.projectRoot, 'docs');
    this.reportsDir = path.join(this.projectRoot, 'reports');

    this.documentationIndex = {
      'README.md': {
        title: 'BasicApp - React Native Job Portal',
        description: 'Main project documentation with quick start guide',
        category: 'overview',
        lastUpdated: new Date().toISOString(),
      },
      'docs/DEVELOPMENT.md': {
        title: 'Development Guide',
        description: 'Comprehensive development documentation',
        category: 'development',
        lastUpdated: new Date().toISOString(),
      },
      'docs/CODE_QUALITY.md': {
        title: 'Code Quality Guidelines',
        description: 'Code quality standards and automated processes',
        category: 'quality',
        lastUpdated: new Date().toISOString(),
      },
      'docs/ARCHITECTURE.md': {
        title: 'Architecture Overview',
        description: 'Technical architecture analysis and design decisions',
        category: 'architecture',
        lastUpdated: new Date().toISOString(),
      },
      'docs/AUTOMATED_REVIEW.md': {
        title: 'Automated Code Review',
        description: 'Automated code review and quality system setup',
        category: 'automation',
        lastUpdated: new Date().toISOString(),
      },
      'docs/PLATFORM_SETUP.md': {
        title: 'Platform Setup Guide',
        description: 'Android and iOS development setup instructions',
        category: 'setup',
        lastUpdated: new Date().toISOString(),
      },
      'docs/ARCHIVE.md': {
        title: 'Documentation Archive',
        description: 'Historical documentation and development reports',
        category: 'archive',
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate documentation index
   */
  generateDocumentationIndex() {
    console.log('📚 Generating documentation index...');

    const indexContent = `# Documentation Index

> **Comprehensive documentation for BasicApp React Native project**

## 📋 Documentation Overview

This project maintains comprehensive documentation organized by topic and audience.

## 📚 Documentation Structure

### 🚀 Getting Started
- **[README.md](../README.md)** - Main project documentation with quick start guide
- **[Platform Setup](PLATFORM_SETUP.md)** - Android and iOS development setup instructions

### 🏗️ Development
- **[Development Guide](DEVELOPMENT.md)** - Comprehensive development documentation
- **[Code Quality Guidelines](CODE_QUALITY.md)** - Code quality standards and automated processes
- **[Architecture Overview](ARCHITECTURE.md)** - Technical architecture analysis and design decisions

### 🤖 Automation
- **[Automated Review](AUTOMATED_REVIEW.md)** - Automated code review and quality system setup

### 📜 Archive
- **[Documentation Archive](ARCHIVE.md)** - Historical documentation and development reports

## 📊 Documentation Categories

### Overview
- Purpose: Project introduction and quick start
- Audience: All developers, new team members
- Files: README.md

### Development
- Purpose: Development workflows and best practices
- Audience: Active developers
- Files: DEVELOPMENT.md, CODE_QUALITY.md, ARCHITECTURE.md

### Setup
- Purpose: Environment setup and configuration
- Audience: New developers, DevOps
- Files: PLATFORM_SETUP.md

### Automation
- Purpose: Automated systems and tooling
- Audience: DevOps, senior developers
- Files: AUTOMATED_REVIEW.md

### Archive
- Purpose: Historical context and legacy information
- Audience: Historical reference
- Files: ARCHIVE.md

## 🔄 Documentation Maintenance

### Automated Updates
- **Quality Reports**: Generated automatically in \`reports/\` directory
- **Documentation Index**: Updated via \`npm run docs:generate\`
- **Link Validation**: Checked during CI/CD pipeline

### Manual Updates
- **Architecture changes**: Update ARCHITECTURE.md
- **New development practices**: Update DEVELOPMENT.md
- **Quality standards changes**: Update CODE_QUALITY.md

## 📈 Documentation Metrics

### Coverage
- **Total Documents**: ${Object.keys(this.documentationIndex).length}
- **Categories**: ${
      [
        ...new Set(
          Object.values(this.documentationIndex).map(doc => doc.category),
        ),
      ].length
    }
- **Last Updated**: ${new Date().toLocaleDateString()}

### Usage Guidelines
1. **Before developing**: Read DEVELOPMENT.md
2. **For setup**: Follow PLATFORM_SETUP.md
3. **For quality**: Reference CODE_QUALITY.md
4. **For architecture**: Review ARCHITECTURE.md
5. **For automation**: Check AUTOMATED_REVIEW.md

## 🛠️ Documentation Tools

### Generation
\`\`\`bash
# Generate documentation index
npm run docs:generate

# Validate documentation links
npm run docs:validate

# Update documentation timestamps
npm run docs:update
\`\`\`

### Maintenance
\`\`\`bash
# Check documentation health
npm run docs:health

# Generate documentation report
npm run docs:report
\`\`\`

## 📝 Contributing to Documentation

### Adding New Documentation
1. Create new file in \`docs/\` directory
2. Update documentation index
3. Add to README.md if needed
4. Update link references

### Updating Existing Documentation
1. Edit relevant file
2. Update timestamps
3. Validate links
4. Update index if structure changes

### Documentation Standards
- **Markdown format**: Use GitHub-flavored markdown
- **Consistent structure**: Follow existing patterns
- **Clear headings**: Use emoji indicators
- **Code examples**: Include working examples
- **Link validation**: Ensure all links work

---

**Documentation is maintained automatically and manually. This index provides a comprehensive overview of all project documentation.**

Last updated: ${new Date().toLocaleString()}
Generated by: Documentation Generator v1.0.0
`;

    fs.writeFileSync(path.join(this.docsDir, 'INDEX.md'), indexContent);
    console.log('✅ Documentation index generated');
  }

  /**
   * Validate documentation links
   */
  validateDocumentationLinks() {
    console.log('🔗 Validating documentation links...');

    const files = fs
      .readdirSync(this.docsDir)
      .filter(file => file.endsWith('.md'));
    const rootFiles = ['README.md'];

    let brokenLinks = 0;
    let totalLinks = 0;

    [...files.map(f => path.join(this.docsDir, f)), ...rootFiles].forEach(
      filePath => {
        if (!fs.existsSync(filePath)) {
          return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const links = content.match(/\[.*?\]\((.*?)\)/g) || [];

        links.forEach(link => {
          totalLinks++;
          const linkPath = link.match(/\[.*?\]\((.*?)\)/)[1];

          // Skip external links
          if (linkPath.startsWith('http')) {
            return;
          }

          // Skip anchors
          if (linkPath.startsWith('#')) {
            return;
          }

          // Resolve relative path
          const resolvedPath = path.resolve(path.dirname(filePath), linkPath);

          if (!fs.existsSync(resolvedPath)) {
            console.log(`❌ Broken link in ${filePath}: ${linkPath}`);
            brokenLinks++;
          }
        });
      },
    );

    console.log(
      `🔗 Link validation complete: ${
        totalLinks - brokenLinks
      }/${totalLinks} links valid`,
    );

    if (brokenLinks > 0) {
      console.log(`⚠️  ${brokenLinks} broken links found`);
      return false;
    }

    return true;
  }

  /**
   * Generate documentation health report
   */
  generateHealthReport() {
    console.log('📊 Generating documentation health report...');

    const report = {
      timestamp: new Date().toISOString(),
      totalDocuments: Object.keys(this.documentationIndex).length,
      categories: [
        ...new Set(
          Object.values(this.documentationIndex).map(doc => doc.category),
        ),
      ],
      documentStatus: {},
      linkValidation: this.validateDocumentationLinks(),
      recommendations: [],
    };

    // Check each document
    Object.entries(this.documentationIndex).forEach(([filePath, info]) => {
      const fullPath = path.resolve(this.projectRoot, filePath);
      const exists = fs.existsSync(fullPath);

      if (exists) {
        const stats = fs.statSync(fullPath);
        const content = fs.readFileSync(fullPath, 'utf8');

        report.documentStatus[filePath] = {
          exists: true,
          size: stats.size,
          lines: content.split('\\n').length,
          lastModified: stats.mtime.toISOString(),
          wordCount: content.split(/\\s+/).length,
        };
      } else {
        report.documentStatus[filePath] = {
          exists: false,
          error: 'File not found',
        };
        report.recommendations.push(
          `Create missing documentation: ${filePath}`,
        );
      }
    });

    // Generate recommendations
    if (!report.linkValidation) {
      report.recommendations.push('Fix broken documentation links');
    }

    Object.entries(report.documentStatus).forEach(([filePath, status]) => {
      if (status.exists) {
        if (status.lines > 1000) {
          report.recommendations.push(
            `Consider splitting large document: ${filePath} (${status.lines} lines)`,
          );
        }
        if (status.wordCount < 100) {
          report.recommendations.push(
            `Expand documentation: ${filePath} (${status.wordCount} words)`,
          );
        }
      }
    });

    // Write report
    const reportPath = path.join(this.reportsDir, 'documentation-health.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Write markdown report
    const markdownReport = `# Documentation Health Report

## 📊 Summary

- **Total Documents**: ${report.totalDocuments}
- **Categories**: ${report.categories.join(', ')}
- **Link Validation**: ${report.linkValidation ? '✅ Passed' : '❌ Failed'}
- **Generated**: ${new Date(report.timestamp).toLocaleString()}

## 📋 Document Status

${Object.entries(report.documentStatus)
  .map(([filePath, status]) => {
    if (status.exists) {
      return `### ${filePath}
- **Size**: ${status.size} bytes
- **Lines**: ${status.lines}
- **Words**: ${status.wordCount}
- **Last Modified**: ${new Date(status.lastModified).toLocaleString()}
- **Status**: ✅ Exists`;
    } else {
      return `### ${filePath}
- **Status**: ❌ Missing
- **Error**: ${status.error}`;
    }
  })
  .join('\n\n')}

## 💡 Recommendations

${
  report.recommendations.length > 0
    ? report.recommendations.map(rec => `- ${rec}`).join('\n')
    : '✅ No recommendations - documentation is healthy!'
}

---

*Generated by Documentation Generator v1.0.0*
`;

    fs.writeFileSync(
      path.join(this.reportsDir, 'documentation-health.md'),
      markdownReport,
    );

    console.log('✅ Documentation health report generated');
    console.log(`📄 Report saved to: ${reportPath}`);

    return report;
  }

  /**
   * Update documentation timestamps
   */
  updateTimestamps() {
    console.log('🕐 Updating documentation timestamps...');

    Object.keys(this.documentationIndex).forEach(filePath => {
      const fullPath = path.resolve(this.projectRoot, filePath);

      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        this.documentationIndex[filePath].lastUpdated =
          stats.mtime.toISOString();
      }
    });

    console.log('✅ Timestamps updated');
  }

  /**
   * Main execution
   */
  async run() {
    console.log('📚 Starting documentation generation...');

    // Ensure directories exist
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
    }

    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }

    // Update timestamps
    this.updateTimestamps();

    // Generate documentation index
    this.generateDocumentationIndex();

    // Generate health report
    const healthReport = this.generateHealthReport();

    // Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log('📚 DOCUMENTATION GENERATION COMPLETE');
    console.log('='.repeat(50));
    console.log(
      `📄 Total documents: ${Object.keys(this.documentationIndex).length}`,
    );
    console.log(
      `📂 Categories: ${
        [
          ...new Set(
            Object.values(this.documentationIndex).map(doc => doc.category),
          ),
        ].length
      }`,
    );
    console.log(
      `🔗 Links valid: ${healthReport.linkValidation ? 'Yes' : 'No'}`,
    );
    console.log(`💡 Recommendations: ${healthReport.recommendations.length}`);
    console.log('='.repeat(50));

    if (healthReport.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      healthReport.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }

    console.log('\n✅ Documentation system ready!');
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new DocumentationGenerator();
  generator.run().catch(console.error);
}

module.exports = { DocumentationGenerator };
