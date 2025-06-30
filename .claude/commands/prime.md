# prime Slash Command

Initialize a new Claude Code agent with complete project context and essential files.

## Purpose
Ensure every new Claude Code agent session starts with comprehensive understanding of the envelope budgeting application project, its architecture, current progress, and development workflows.

## Usage
```
/prime
```

## Command Steps

Follow these steps to fully orient to the project:

### 1. Read Core Project Documentation
```bash
# Read the main project context file
```
Use `Read` tool to examine:
- `CLAUDE.md` - Complete project overview, architecture, and development guidelines
- `plan.md` - Implementation roadmap, current progress, and session history

### 2. Review Technical Specifications
```bash
# Examine the technical architecture
```
Use `Read` tool to understand:
- `.claude/specs/architecture.md` - Technical stack and monorepo structure
- `.claude/specs/domain-model.md` - Cascading bucket algorithm and business logic
- `.claude/specs/database-schema.md` - PostgreSQL schema and data relationships
- `.claude/specs/backend-spec.md` - Fastify and DAO pattern implementation
- `.claude/specs/frontend-spec.md` - TanStack ecosystem and React architecture

### 3. Understand Current Development Status
```bash
# Check git status and recent commits
git status
git log --oneline -10
```

### 4. Review Available Slash Commands
Use `Read` tool to examine available project commands:
- `.claude/commands/pushIssue.md` - Create comprehensive GitHub issues
- `.claude/commands/pullIssue.md` - Fetch issues and create worktrees
- `.claude/commands/closeIssue.md` - Complete issues and cleanup
- `.claude/commands/prime.md` - This command (for reference)

### 5. Check Project Environment
```bash
# Verify development environment
pnpm --version
docker --version
gh --version
```

### 6. Assess GitHub Issues Status
```bash
# Check current issues
gh issue list --state open --limit 5
```

## Response Format

After completing the prime sequence, provide this summary:

```markdown
# 🤖 Claude Code Agent Initialized

## Project Understanding ✅
- **Project**: Envelope Budgeting Application (Monorepo)
- **Phase**: [Current phase from plan.md]
- **Architecture**: TypeScript monorepo with pnpm workspaces
- **Stack**: Fastify backend, React frontend, PostgreSQL database
- **Pattern**: DAO abstraction with Drizzle ORM

## Key Principles Understood ✅
- **DAO Pattern**: Never bypass database abstraction layer
- **TypeScript**: Strict mode across all packages
- **Monorepo**: Maintain workspace boundaries
- **Documentation**: Keep living docs current
- **Attribution**: Use Claude Code footer in GitHub issues

## Current Status ✅
- **Git Branch**: [current branch]
- **Open Issues**: [count] issues ready for work
- **Phase Progress**: [progress summary from plan.md]
- **Environment**: [environment check results]

## Available Commands ✅
- `/pushIssue [task]` - Create comprehensive GitHub issues
- `/pullIssue [number]` - Fetch issue and create worktree
- `/closeIssue [number]` - Complete issue and cleanup
- `/prime` - Initialize new agent (this command)

## Ready for Work 🚀
This agent is now fully oriented and ready to contribute to the envelope budgeting application. 

**Suggested Next Actions:**
- Use `/pullIssue` to examine specific issues
- Use `/pushIssue` to create new issues for missing tasks
- Review plan.md for next phase priorities
- Check `.claude/specs/` for implementation details

**Remember**: All database operations must go through DAO layer, maintain TypeScript strict mode, and use git worktree workflow for issue development.
```

## Context Areas to Emphasize

### Project Mission
- Modern envelope budgeting application
- Sandbox for exploring agentic workflows with Claude Code
- Demonstrates best practices for AI-assisted development

### Technical Architecture
- **Monorepo**: pnpm workspaces structure
- **Backend**: Fastify + TypeScript + DAO pattern
- **Frontend**: React + complete TanStack ecosystem
- **Database**: PostgreSQL + Drizzle ORM
- **Development**: Docker containerization

### Critical Constraints
- **DAO Pattern**: NEVER bypass database abstraction
- **TypeScript**: Strict mode, explicit types, comprehensive error handling
- **Monorepo**: Respect workspace boundaries
- **Testing**: Comprehensive coverage expected
- **Documentation**: Living docs that evolve with code

### Development Workflows
- **Issue Management**: Use GitHub CLI with attribution
- **Git Worktrees**: Isolated development environments
- **Phase-Based**: Structured implementation approach
- **Quality First**: Emphasis on maintainable, clean code

## Integration Notes

- This command should be run at the start of every new Claude Code session
- Ensures consistent understanding across different agent instances
- Prevents knowledge gaps that could lead to architectural violations
- Establishes context for effective multi-agent collaboration

## Error Handling

- **Missing Files**: Provide clear guidance on which files are critical
- **Environment Issues**: Help troubleshoot development setup
- **Permission Problems**: Guide through GitHub CLI authentication
- **Git Issues**: Assist with repository state understanding

## Remember

- This is a learning and experimentation project
- Code quality and architecture matter more than speed
- The DAO pattern is non-negotiable
- All agents should understand the cascading bucket algorithm
- Documentation should stay current with implementation