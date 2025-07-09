# Claude Code Configuration

## Cross-Platform React Native Development

### Project Overview

- **Platform**: React Native 0.80.0 (Mac) / 0.74.7 (Windows)
- **Language**: TypeScript (preferred) with JSX components
- **Development**: Cross-platform Windows/Mac compatibility

### Common Commands

#### Development

```bash
npm start              # Start Metro bundler
npm run android        # Run on Android (requires Android SDK)
npm run ios           # Run on iOS (Mac only)
npm test              # Run Jest tests
npm run lint          # Run ESLint
```

#### Cross-Platform Considerations

- Use forward slashes `/` in paths for cross-platform compatibility
- Environment variables: Use `$VAR` (Unix) or `%VAR%` (Windows) as needed
- Line endings: Auto-handled by .gitattributes

### Linting & Code Quality

- **ESLint**: `npm run lint`
- **Prettier**: Integrated with ESLint
- **TypeScript**: Use .tsx for React components, .ts for utilities

### Platform-Specific Notes

#### Windows Development

- Android SDK paths configured in `android/local.properties`
- Use Git Bash or PowerShell for commands
- WSL compatibility for Unix-style paths

#### Mac Development

- Native iOS development support
- Xcode required for iOS builds
- CocoaPods for iOS dependencies

### Branch Management

- **main/master**: Stable production code
- **feature/landingPage&dashboard**: Mac development (RN 0.80.0)
- **another-branch**: Windows development (RN 0.74.7)

### Migration Guidelines

1. Maintain TypeScript types when migrating from .jsx to .tsx
2. Test on both platforms before merging
3. Use relative imports for cross-platform compatibility
4. Keep Android/iOS configs platform-neutral where possible

### Troubleshooting

- Clear Metro cache: `npx react-native start --reset-cache`
- Clean build: `cd android && ./gradlew clean`
- Reset Node modules: `rm -rf node_modules && npm install`

---

# Task Master AI - Claude Code Integration Guide

## Essential Commands

### Core Workflow Commands

```bash
# Project Setup
task-master init                                    # Initialize Task Master in current project
task-master parse-prd .taskmaster/docs/prd.txt      # Generate tasks from PRD document
task-master models --setup                        # Configure AI models interactively

# Daily Development Workflow
task-master list                                   # Show all tasks with status
task-master next                                   # Get next available task to work on
task-master show <id>                             # View detailed task information (e.g., task-master show 1.2)
task-master set-status --id=<id> --status=done    # Mark task complete

# Task Management
task-master add-task --prompt="description" --research        # Add new task with AI assistance
task-master expand --id=<id> --research --force              # Break task into subtasks
task-master update-task --id=<id> --prompt="changes"         # Update specific task
task-master update --from=<id> --prompt="changes"            # Update multiple tasks from ID onwards
task-master update-subtask --id=<id> --prompt="notes"        # Add implementation notes to subtask

# Analysis & Planning
task-master analyze-complexity --research          # Analyze task complexity
task-master complexity-report                      # View complexity analysis
task-master expand --all --research               # Expand all eligible tasks

# Dependencies & Organization
task-master add-dependency --id=<id> --depends-on=<id>       # Add task dependency
task-master move --from=<id> --to=<id>                       # Reorganize task hierarchy
task-master validate-dependencies                            # Check for dependency issues
task-master generate                                         # Update task markdown files (usually auto-called)
```

## Key Files & Project Structure

### Core Files

- `.taskmaster/tasks/tasks.json` - Main task data file (auto-managed)
- `.taskmaster/config.json` - AI model configuration (use `task-master models` to modify)
- `.taskmaster/docs/prd.txt` - Product Requirements Document for parsing
- `.taskmaster/tasks/*.txt` - Individual task files (auto-generated from tasks.json)
- `.env` - API keys for CLI usage

### Claude Code Integration Files

- `CLAUDE.md` - Auto-loaded context for Claude Code (this file)
- `.claude/settings.json` - Claude Code tool allowlist and preferences
- `.claude/commands/` - Custom slash commands for repeated workflows
- `.mcp.json` - MCP server configuration (project-specific)

### React Native Project Structure

```
project/
├── src/
│   ├── components/ui/        # Reusable UI components (Button, Card, Input, Badge)
│   ├── contexts/            # React contexts (Auth, User)
│   ├── navigation/          # Navigation components (MainNavigator)
│   ├── screens/            # Screen components (Dashboard, IndexScreen, etc.)
│   ├── theme/              # Theme system (colors, typography, spacing)
│   └── types/              # TypeScript type definitions
├── android/                # Android-specific files
├── ios/                   # iOS-specific files (Mac only)
├── .taskmaster/
│   ├── tasks/              # Task files directory
│   │   ├── tasks.json      # Main task database
│   │   ├── task-1.md      # Individual task files
│   │   └── task-2.md
│   ├── docs/              # Documentation directory
│   │   ├── prd.txt        # Product requirements
│   ├── reports/           # Analysis reports directory
│   │   └── task-complexity-report.json
│   ├── templates/         # Template files
│   │   └── example_prd.txt  # Example PRD template
│   └── config.json        # AI models & settings
├── .claude/
│   ├── settings.json      # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .env                  # API keys
├── .mcp.json            # MCP configuration
└── CLAUDE.md            # This file - auto-loaded by Claude Code
```

## MCP Integration

Task Master provides an MCP server that Claude Code can connect to. Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your_key_here",
        "PERPLEXITY_API_KEY": "your_key_here",
        "OPENAI_API_KEY": "OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "GOOGLE_API_KEY_HERE",
        "XAI_API_KEY": "XAI_API_KEY_HERE",
        "OPENROUTER_API_KEY": "OPENROUTER_API_KEY_HERE",
        "MISTRAL_API_KEY": "MISTRAL_API_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "AZURE_OPENAI_API_KEY_HERE",
        "OLLAMA_API_KEY": "OLLAMA_API_KEY_HERE"
      }
    }
  }
}
```

### Essential MCP Tools

```javascript
help; // = shows available taskmaster commands
// Project setup
initialize_project; // = task-master init
parse_prd; // = task-master parse-prd

// Daily workflow
get_tasks; // = task-master list
next_task; // = task-master next
get_task; // = task-master show <id>
set_task_status; // = task-master set-status

// Task management
add_task; // = task-master add-task
expand_task; // = task-master expand
update_task; // = task-master update-task
update_subtask; // = task-master update-subtask
update; // = task-master update

// Analysis
analyze_project_complexity; // = task-master analyze-complexity
complexity_report; // = task-master complexity-report
```

## React Native Development Workflow

### Standard Development Workflow

#### 1. Project Setup

```bash
# Initialize React Native development
npm install                                        # Install dependencies
cd ios && pod install && cd .. (Mac only)         # Install iOS dependencies

# Initialize Task Master
task-master init

# Create or obtain PRD, then parse it
task-master parse-prd .taskmaster/docs/prd.txt

# Analyze complexity and expand tasks
task-master analyze-complexity --research
task-master expand --all --research
```

#### 2. Daily Development Loop

```bash
# Start development environment
npm start                                  # Start Metro bundler
npm run android                           # Run on Android
npm run ios                               # Run on iOS (Mac only)

# Task Master workflow
task-master next                           # Find next available task
task-master show <id>                     # Review task details

# During implementation, check in code context into the tasks and subtasks
task-master update-subtask --id=<id> --prompt="implementation notes..."

# Code quality checks
npm run lint                              # Check ESLint
npm run type-check                        # TypeScript check

# Complete tasks
task-master set-status --id=<id> --status=done
```

#### 3. React Native Specific Workflows

```bash
# Development commands
npm run lint:fix                          # Auto-fix linting issues
npm run format                            # Prettier formatting
npm start:reset                           # Start with cache reset

# Platform-specific testing
npm run android                           # Test Android build
npm run ios                               # Test iOS build (Mac only)

# Cleanup commands
npx react-native start --reset-cache      # Clear Metro cache
cd android && ./gradlew clean && cd ..    # Clean Android build
rm -rf node_modules && npm install        # Reset dependencies
```

### React Native Custom Slash Commands

Create `.claude/commands/rn-dev-start.md`:

```markdown
Start React Native development environment.

Steps:

1. Run `npm start` to start Metro bundler
2. In parallel terminals, run platform-specific commands:
   - `npm run android` for Android
   - `npm run ios` for iOS (Mac only)
3. Check for any build errors
4. Run `task-master next` to get next task
```

Create `.claude/commands/rn-lint-fix.md`:

```markdown
Fix React Native linting and formatting issues.

Steps:

1. Run `npm run lint` to check current issues
2. Run `npm run lint:fix` to auto-fix issues
3. Run `npm run format` for Prettier formatting
4. Run `npm run type-check` for TypeScript validation
5. Commit changes if all checks pass
```

## Tool Allowlist Recommendations

Add to `.claude/settings.json`:

```json
{
  "allowedTools": [
    "Edit",
    "Bash(task-master *)",
    "Bash(npm *)",
    "Bash(npx *)",
    "Bash(git commit:*)",
    "Bash(git add:*)",
    "Bash(cd android && ./gradlew *)",
    "Bash(cd ios && *)",
    "mcp__task_master_ai__*"
  ]
}
```

## Configuration & Setup

### API Keys Required

At least **one** of these API keys must be configured:

- `ANTHROPIC_API_KEY` (Claude models) - **Recommended**
- `PERPLEXITY_API_KEY` (Research features) - **Highly recommended**
- `OPENAI_API_KEY` (GPT models)
- `GOOGLE_API_KEY` (Gemini models)
- `MISTRAL_API_KEY` (Mistral models)
- `OPENROUTER_API_KEY` (Multiple models)
- `XAI_API_KEY` (Grok models)

### Model Configuration

```bash
# Interactive setup (recommended)
task-master models --setup

# Set specific models
task-master models --set-main claude-3-5-sonnet-20241022
task-master models --set-research perplexity-llama-3.1-sonar-large-128k-online
task-master models --set-fallback gpt-4o-mini
```

## React Native Best Practices with Task Master

### Cross-Platform Development

1. **Platform Testing**: Always test on both Android and iOS (when available)
2. **Path Handling**: Use forward slashes in all paths for cross-platform compatibility
3. **TypeScript**: Maintain strict typing, especially for navigation and components
4. **Linting**: Run `npm run lint` before committing changes

### Context Management

- Use `/clear` between different tasks to maintain focus
- This CLAUDE.md file is automatically loaded for context
- Use `task-master show <id>` to pull specific task context when needed

### Iterative Implementation

1. `task-master show <subtask-id>` - Understand requirements
2. Start development environment (`npm start`, `npm run android/ios`)
3. `task-master update-subtask --id=<id> --prompt="detailed plan"` - Log plan
4. `task-master set-status --id=<id> --status=in-progress` - Start work
5. Implement code following logged plan
6. Run `npm run lint` and `npm run type-check`
7. `task-master update-subtask --id=<id> --prompt="what worked/didn't work"` - Log progress
8. `task-master set-status --id=<id> --status=done` - Complete task

### Git Integration

Task Master works well with React Native development:

```bash
# Create PR for completed React Native task
gh pr create --title "Complete task 1.2: User authentication UI" --body "Implements authentication screens as specified in task 1.2"

# Reference task in commits
git commit -m "feat(auth): implement login screen (task 1.2)"
git commit -m "fix(android): resolve build issues (task 1.3)"
```

## Troubleshooting

### React Native Specific Issues

```bash
# Metro bundler issues
npx react-native start --reset-cache

# Android build issues
cd android && ./gradlew clean && cd ..
rm -rf node_modules && npm install

# iOS build issues (Mac only)
cd ios && rm -rf Pods && pod install && cd ..

# TypeScript issues
npm run type-check
```

### Task Master Issues

```bash
# Check API keys are configured
cat .env                           # For CLI usage

# Verify model configuration
task-master models

# Test with different model
task-master models --set-fallback gpt-4o-mini
```

### MCP Connection Issues

- Check `.mcp.json` configuration
- Verify Node.js installation
- Use `--mcp-debug` flag when starting Claude Code
- Use CLI as fallback if MCP unavailable

## Important Notes

### File Management

- Never manually edit `tasks.json` - use commands instead
- Never manually edit `.taskmaster/config.json` - use `task-master models`
- Task markdown files in `tasks/` are auto-generated
- Run `task-master generate` after manual changes to tasks.json

### React Native Session Management

- Use `/clear` frequently to maintain focused context
- Create custom slash commands for repeated React Native workflows
- Configure tool allowlist to streamline permissions
- Always test on target platforms before marking tasks complete

### Multi-Platform Development

- Use `npm run android` and `npm run ios` to test both platforms
- Pay attention to platform-specific styling and behavior
- Use relative imports for cross-platform compatibility
- Keep configurations platform-neutral where possible

---

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

_This guide ensures Claude Code has immediate access to both Task Master's essential functionality and React Native development best practices for agentic development workflows._
