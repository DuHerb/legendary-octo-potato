# pullIssue Slash Command

Retrieve and analyze GitHub issues for: $ARGUMENTS

## Purpose
Fetch GitHub issue details and provide intelligent analysis to understand current work status, dependencies, and actionable next steps.

## Usage Examples
- `/pullIssue 5` - Get specific issue #5
- `/pullIssue Phase 2` - Find all issues related to Phase 2
- `/pullIssue database` - Find all issues containing "database"
- `/pullIssue open` - List all open issues
- `/pullIssue` - List recent issues (default if no $ARGUMENTS)

## Command Steps

Follow these steps to analyze GitHub issues for: $ARGUMENTS

### 1. Determine Request Type
Analyze "$ARGUMENTS" to determine the appropriate GitHub CLI command:
- **Specific Issue**: If "$ARGUMENTS" is a number, use `gh issue view $ARGUMENTS`
- **Search Query**: If text, use `gh issue list --search "$ARGUMENTS" --state all`
- **Status Filter**: If "open", "closed", or "all", use `gh issue list --state $ARGUMENTS`
- **Default**: If no $ARGUMENTS provided, use `gh issue list --state open --limit 10`

### 2. Execute GitHub CLI Commands
Based on the request type, run the appropriate command:
```bash
# For specific issue number
gh issue view $ARGUMENTS

# For search terms
gh issue list --search "$ARGUMENTS" --state all --limit 20

# For status filters
gh issue list --state $ARGUMENTS --limit 15
```

### 3. Create Git Worktree for Issue (if specific issue number)
If "$ARGUMENTS" is a specific issue number, create a dedicated worktree:
```bash
# Create branch name from issue (e.g., issue-5-database-setup)
BRANCH_NAME="issue-$ARGUMENTS-$(gh issue view $ARGUMENTS --json title -q .title | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g' | cut -c1-50)"

# Create worktree in ../worktrees directory
git worktree add "../worktrees/$BRANCH_NAME" -b "$BRANCH_NAME"

# Update issue with worktree path comment
gh issue comment $ARGUMENTS --body "🔧 **Worktree Created**: \`../worktrees/$BRANCH_NAME\`

Work for this issue should be done in the dedicated worktree to keep changes isolated.

To switch to this worktree:
\`\`\`bash
cd ../worktrees/$BRANCH_NAME
\`\`\`"
```

### 4. Change to Worktree Directory
If worktree was created, change to that directory:
```bash
cd "../worktrees/$BRANCH_NAME"
```

### 5. Analyze and Present Issues

For each issue, provide:
- **Issue Number & Title**
- **Status** (open/closed)
- **Labels** 
- **Creation Date**
- **Brief Summary** (first few lines of description)
- **Assignees** (if any)
- **Related Context** (extracted from issue body)

### 4. Intelligent Context Extraction

From issue content, identify:
- **Phase Information**: Which implementation phase it belongs to
- **Technical Domain**: Database, Backend, Frontend, etc.
- **Dependencies**: Related issues mentioned
- **Progress Status**: Based on checkboxes or completion indicators
- **Specifications Referenced**: Which .claude/specs files are mentioned

### 5. Provide Actionable Insights

Based on the issues retrieved:
- **Work Status**: What's in progress, blocked, or ready to start
- **Dependencies**: Which issues depend on others
- **Next Actions**: Suggested next steps based on issue analysis
- **Context Gaps**: Missing information or unclear requirements

## Response Format

### For Specific Issue (when $ARGUMENTS is a number)
```markdown
# Issue #$ARGUMENTS: [Title]

**Status**: [Open/Closed] | **Created**: [timeframe] | **Labels**: [label list]
**Worktree**: `../worktrees/[branch-name]` (created and ready for work)

## Description Summary
[First paragraph or key points from issue description]

## Context Analysis
- **Phase**: [Identified phase from content]
- **Domain**: [Technical domain - Database/Backend/Frontend]
- **Specifications**: [Referenced .claude/specs files]
- **Dependencies**: [Related issues or prerequisites]

## Progress Indicators
[Extract any checkboxes or task lists from issue body]

## Working Environment
- **Current Directory**: `../worktrees/[branch-name]`
- **Branch**: `issue-$ARGUMENTS-[sanitized-title]`
- **Isolation**: All work contained in dedicated worktree

## Recommended Next Actions
[Based on issue status and content analysis]

## Ready to Start
The worktree is created and you're now working in an isolated environment. All changes will be contained to this branch until ready to merge.
```

### For Multiple Issues (when $ARGUMENTS is search term)
```markdown
# Issue Analysis for: "$ARGUMENTS"

## Found Issues ([count])

### #[number]: [Title]
**Labels**: [labels] | **Created**: [timeframe] | **Status**: [Open/Closed]
Brief: [First sentence of description]

[Repeat for each issue found]

## Work Status Analysis
- **In Progress**: [count] issues actively being worked on
- **Ready to Start**: [count] issues with dependencies met
- **Blocked**: [count] issues waiting on dependencies

## Recommendations
[Prioritized list of suggested actions based on issue analysis]
```

## Advanced Features

### 1. Issue Relationship Mapping
- Identify issues that reference each other
- Show dependency chains
- Highlight blocking relationships

### 2. Phase Progress Tracking
- Calculate completion percentage for phases
- Show which phase tasks are complete/pending
- Identify phase bottlenecks

### 3. Specification Cross-Reference
- Show which issues reference each spec file
- Identify specification gaps or conflicts
- Suggest specification updates

### 4. Work Planning Insights
- Recommend next issue to work on
- Identify work that can be done in parallel
- Flag issues that may be stale or need updates

## Error Handling

- **Issue Not Found**: If "$ARGUMENTS" is a number but issue doesn't exist, provide clear message
- **No Matching Issues**: If search for "$ARGUMENTS" returns no results, suggest broader search terms
- **GitHub CLI Errors**: Check authentication and provide troubleshooting steps
- **Empty Arguments**: If no $ARGUMENTS provided, default to listing recent open issues

## Integration Points

- Cross-reference found issues with current plan.md progress
- Identify gaps where pushIssue could create missing issues
- Suggest next actions based on project phase and issue status

## Remember

- Always use the exact "$ARGUMENTS" value in GitHub CLI commands
- Provide actionable analysis, not just raw issue data
- Consider broader project context from CLAUDE.md and plan.md when making recommendations
- Use GitHub CLI (`gh`) for all GitHub operations