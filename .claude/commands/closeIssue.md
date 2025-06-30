# closeIssue Slash Command

Complete and close GitHub issue with cleanup: $ARGUMENTS

## Purpose
Mark issue as completed, create pull request if needed, clean up the associated git worktree, and update project tracking.

## Usage Examples
- `/closeIssue 5` - Close issue #5 and clean up worktree
- `/closeIssue 5 --no-pr` - Close issue without creating PR
- `/closeIssue 5 --draft` - Create draft PR for review

## Command Steps

Follow these steps to close issue: $ARGUMENTS

### 1. Validate Issue Exists
```bash
# Check if issue exists and get details
gh issue view $ARGUMENTS
```

### 2. Identify Associated Worktree
Look for worktree path in issue comments:
```bash
# Check for worktree comment in issue
gh issue view $ARGUMENTS --comments | grep -o "../worktrees/issue-$ARGUMENTS-[^']*"
```

### 3. Verify Work is Complete
Before closing, ensure:
- [ ] All tasks in issue are completed
- [ ] Code changes are committed
- [ ] Tests pass (if applicable)
- [ ] TypeScript compiles without errors

### 4. Create Pull Request (default behavior)
If work involves code changes:
```bash
# Push branch to origin
git push origin "issue-$ARGUMENTS-[branch-name]"

# Create PR with reference to issue
gh pr create --title "Closes #$ARGUMENTS: [issue-title]" --body "Closes #$ARGUMENTS

## Changes Made
[Summary of changes]

## Testing
- [ ] TypeScript compilation passes
- [ ] Tests pass (if applicable)
- [ ] Follows DAO pattern requirements
- [ ] Maintains monorepo structure

## Related Issue
Resolves #$ARGUMENTS

---
🤖 Created by Claude Code

Co-authored-by: Claude <noreply@anthropic.com>"
```

### 5. Close the Issue
```bash
# Close issue with completion comment
gh issue close $ARGUMENTS --comment "✅ **Issue Completed**

This issue has been resolved and the associated worktree has been cleaned up.

$(if PR created)
**Pull Request**: [PR URL]
$(endif)

**Branch**: Merged and cleaned up
**Worktree**: Removed from ../worktrees/

---
🤖 Closed by Claude Code"
```

### 6. Clean Up Worktree
Remove the associated git worktree:
```bash
# Get the worktree path
WORKTREE_PATH=$(gh issue view $ARGUMENTS --comments | grep -o "../worktrees/issue-$ARGUMENTS-[^']*" | head -1)

# Remove worktree and branch
if [[ -n "$WORKTREE_PATH" && -d "$WORKTREE_PATH" ]]; then
    # Return to main repository
    cd "$(git rev-parse --show-toplevel)"
    
    # Remove worktree
    git worktree remove "$WORKTREE_PATH" --force
    
    # Delete local branch (after PR is merged)
    BRANCH_NAME=$(basename "$WORKTREE_PATH")
    git branch -D "$BRANCH_NAME" 2>/dev/null || true
    
    echo "🧹 Cleaned up worktree: $WORKTREE_PATH"
else
    echo "⚠️ No worktree found for issue #$ARGUMENTS"
fi
```

### 7. Update Project Tracking
If issue is part of a phase, update plan.md:
```bash
# Check if this was a phase-related issue
if gh issue view $ARGUMENTS --json labels -q '.labels[].name' | grep -q "phase"; then
    echo "📋 Consider updating plan.md to reflect completed work"
fi
```

## Command Options

### --no-pr
Skip pull request creation (for non-code changes):
```bash
# Just close issue and clean worktree without PR
```

### --draft
Create draft pull request for review:
```bash
gh pr create --draft --title "Draft: Closes #$ARGUMENTS" ...
```

### --keep-worktree
Close issue but keep worktree for additional work:
```bash
# Skip worktree cleanup step
```

## Error Handling

- **Issue Not Found**: Clear error message with suggestion to check issue number
- **No Worktree Found**: Close issue normally but warn about missing worktree
- **Uncommitted Changes**: Warn about uncommitted work and provide options
- **PR Creation Fails**: Close issue anyway but provide manual PR instructions
- **Worktree Removal Fails**: Provide manual cleanup instructions

## Pre-Close Checklist

Before running closeIssue, ensure:
- [ ] All code changes are committed
- [ ] Tests pass: `pnpm test`
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] Code follows project standards: `pnpm lint`
- [ ] DAO pattern maintained (if applicable)
- [ ] Documentation updated (if needed)

## Integration with Other Commands

- **pullIssue**: Creates worktrees that closeIssue cleans up
- **pushIssue**: Creates issues that closeIssue completes
- **plan.md**: References phases that issues help complete

## Response Format

```markdown
# Issue #$ARGUMENTS Closed Successfully

## Summary
- **Issue**: #$ARGUMENTS - [Title]
- **Status**: Closed ✅
- **Pull Request**: [PR URL or "None created"]
- **Worktree**: Cleaned up ✅
- **Branch**: [Merged/Deleted]

## Actions Taken
1. ✅ Verified issue completion
2. ✅ Created pull request (if applicable)
3. ✅ Closed GitHub issue
4. ✅ Cleaned up git worktree
5. ✅ Removed local branch

## Next Steps
- Monitor PR for review/merge (if created)
- Consider updating plan.md progress
- Continue with related issues or next phase

**Ready for next task!**
```

## Remember

- Always ensure work is complete before closing
- Create descriptive PR titles that reference the issue
- Clean up worktrees to avoid directory clutter
- Update issue with clear completion status
- Use GitHub CLI for all GitHub operations
- Follow established commit and PR conventions