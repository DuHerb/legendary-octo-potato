# pushIssue Slash Command

Create a comprehensive GitHub issue with full context for other Claude Code agents: $ARGUMENTS

## Purpose
Extract relevant context from plan.md and technical specifications to create detailed GitHub issues that provide sufficient context for other Claude agents to complete tasks independently.

## Usage Examples
- `/pushIssue Phase 2`
- `/pushIssue Database Layer`  
- `/pushIssue Implement Drizzle ORM configuration`
- `/pushIssue Set up DAO pattern for buckets`

## Command Steps

Follow these steps to create a comprehensive GitHub issue for: $ARGUMENTS

- Determine if "$ARGUMENTS" contains a phase identifier (e.g., "Phase 2") 
- If phase mentioned, use `Read` tool to extract that entire phase section from plan.md
- If specific task mentioned, use `Grep` tool to search plan.md for related content
- If new task, proceed with the description as provided

### 2. Extract Context from plan.md
- Use `Read` tool to examine plan.md structure
- If "$ARGUMENTS" contains "Phase X", extract the complete phase section including:
  - Status and estimated duration
  - All subtasks and checkboxes
  - Dependencies and prerequisites
- If not a phase, search for related tasks using `Grep` tool

### 3. Identify Relevant Technical Specifications
Analyze "$ARGUMENTS" keywords to determine which specs to reference:
- Database/Schema/DAO/Drizzle → `.claude/specs/database-schema.md`
- Backend/API/Fastify/Service → `.claude/specs/backend-spec.md`
- Frontend/React/TanStack/Component → `.claude/specs/frontend-spec.md`
- Domain/Algorithm/Business/Cascade → `.claude/specs/domain-model.md`
- Architecture/Monorepo/Infrastructure → `.claude/specs/architecture.md`

### 4. Generate Issue Title
Create descriptive title based on "$ARGUMENTS":
- For phases: "Phase X: [Brief description]"
- For specific tasks: Use first 60 characters of "$ARGUMENTS"
- Make titles descriptive but concise

### 5. Create GitHub Issue
Use `gh issue create` with the generated title and body structure:

```markdown
## Task Description
$ARGUMENTS

## Context from plan.md
[Extracted phase information or related tasks from plan.md]

## Relevant Technical Specifications
[List of applicable spec files based on keyword analysis]

## Key Project Files for Context
- **Project Overview**: `CLAUDE.md` - Complete project context and development guidelines
- **Implementation Plan**: `plan.md` - Cross-session progress tracking and roadmap
- **Technical Specs**: `.claude/specs/` - Detailed architectural specifications

## Critical Development Guidelines

### TypeScript Requirements
- Strict mode enabled across all packages
- Explicit return types for public functions
- Comprehensive error handling with typed errors

### DAO Pattern Requirements (CRITICAL)
- All database operations MUST go through DAO layer
- Never import database schema directly in business logic
- Use dependency injection for DAO instances

### Monorepo Structure
- Use pnpm workspaces for package management
- Maintain clear boundaries between packages
- Follow established naming conventions

## Success Criteria
- [ ] Implementation follows established architectural patterns
- [ ] TypeScript compiles without errors in strict mode
- [ ] DAO pattern is properly maintained (if applicable)
- [ ] Tests are included where appropriate
- [ ] Documentation is updated if needed

## Dependencies
[Any related issues or prerequisites]

---
🤖 Created by Claude Code

Co-authored-by: Claude <noreply@anthropic.com>
```

### 4. Create the GitHub Issue
- Use `gh issue create` with appropriate title and body
- Add relevant labels based on content (database, backend, frontend, phase)
- Return the issue URL

### 6. Add Labels Based on Content
Analyze "$ARGUMENTS" to add relevant labels:
- Use `gh issue edit` to add labels like "database", "backend", "frontend", "phase"
- Base labels on keyword detection in the task description

### 7. Return Issue URL
Provide the created issue URL for reference and tracking.

## Error Handling

- If plan.md doesn't contain the requested phase/task, create issue anyway with available context
- If GitHub CLI fails, provide clear error message with troubleshooting steps
- Always include minimum viable context even if file extraction fails

## Remember

- Use the exact "$ARGUMENTS" text in the issue description
- Always include the standardized Claude Code attribution footer
- Leverage Read, Grep, and Bash tools for file operations
- Provide comprehensive context for the receiving Claude agent