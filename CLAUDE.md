# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Envelope Budgeting Application

## Project Context

This is a modern envelope budgeting application being built as a sandbox project for exploring agentic workflows with Claude Code. The project serves dual purposes: creating a useful personal finance tool and demonstrating best practices for AI-assisted development.

## User Profile & Preferences

### Technical Background
- **Experience Level**: Senior developer with full-stack capabilities
- **Previous Project**: Built an envelope budgeting app early in career (junior-level implementation)
- **Current Goal**: Complete rewrite using modern tools and agentic workflows

### Technology Preferences
- **Frontend**: React with Vite, complete TanStack ecosystem (Router, Query, Form, Store)
- **Backend**: TypeScript-first with Fastify, DAO pattern for database abstraction
- **Database**: PostgreSQL with Drizzle ORM, containerized for development
- **Architecture**: Monorepo structure with pnpm workspaces
- **AI Integration**: Claude Code with MCP protocols

### Development Philosophy
- **Quality Over Speed**: Emphasis on clean, maintainable code
- **Documentation-Driven**: Living documentation that evolves with code
- **Experimentation-Friendly**: Sandbox environment for trying new approaches
- **Learning-Oriented**: Project is educational vehicle for new tools/patterns

## Project Objectives

### Primary Goals
1. **Functional App**: Working envelope budgeting system
2. **Agentic Exploration**: Deep dive into Claude Code capabilities
3. **Modern Architecture**: Showcase current best practices
4. **Learning Platform**: Experimental ground for new technologies

### Success Criteria
- Clean, type-safe codebase with comprehensive testing
- Effective multi-agent workflows using Claude Code
- Seamless Docker-based development environment
- Living documentation that stays current with implementation

## Core Domain Concepts

### Envelope Budgeting
- **Envelopes**: Budget categories with allocated amounts
- **Transactions**: Income and expenses assigned to envelopes
- **Allocation**: Process of distributing income across envelopes
- **Transfer**: Moving funds between envelopes
- **Reconciliation**: Ensuring actual spending matches envelope balances

### User Workflows
1. **Setup**: Create envelopes and set initial allocations
2. **Income Processing**: Distribute new income across envelopes
3. **Expense Tracking**: Record and categorize spending
4. **Budget Review**: Analyze spending patterns and adjust allocations
5. **Goal Management**: Set and track financial objectives

## Technical Architecture Principles

### Code Organization
- **Monorepo Structure**: Multiple packages with shared dependencies
- **Type Safety**: TypeScript throughout with strict configuration
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Testability**: Architecture that supports comprehensive testing

### AI Integration Patterns
- **Context Preservation**: Maintain project context across Claude Code sessions
- **Task Specialization**: Different agents for frontend, backend, testing, etc.
- **Documentation Sync**: Keep claude.md files current with implementation
- **Progressive Enhancement**: Gradually introduce more sophisticated AI workflows

## Development Constraints

### Must Haves
- Monorepo structure with proper workspace management
- DAO pattern for database abstraction and flexibility
- Comprehensive TypeScript coverage with strict mode
- Living documentation (claude.md, plan.md)
- GitHub CLI integration for PR management
- Claude Code containerization for security

### Nice to Haves
- Advanced analytics and reporting
- Mobile-optimized responsive design
- Bank transaction import capabilities
- Multi-user support for shared budgets

### Avoid
- Over-engineering early features
- Tight coupling between layers (maintain DAO abstraction)
- Missing or outdated documentation
- Breaking monorepo workspace boundaries
- Bypassing the DAO layer for direct database access

## Communication Preferences

### Code Style
- Prefer explicit over implicit
- Comprehensive error handling
- Clear variable and function naming
- Minimal but effective comments

### Documentation Style
- Practical examples over theoretical explanations
- Living documents that evolve with code
- Context-rich information for AI agents
- Clear action items and next steps

### Problem-Solving Approach
- Break complex problems into smaller tasks
- Prototype and iterate rather than perfect upfront
- Use multiple AI agents for different perspectives
- Document lessons learned and pattern discoveries

## Development Commands

### Monorepo Management
- `pnpm install` - Install all dependencies across workspaces
- `pnpm --filter <workspace>` - Run commands in specific workspace
- `pnpm -r <command>` - Run command in all workspaces

### Database Operations
- `docker compose up postgres` - Start PostgreSQL container
- `pnpm --filter backend db:generate` - Generate Drizzle migrations
- `pnpm --filter backend db:migrate` - Run database migrations
- `pnpm --filter backend db:seed` - Seed development data

### Development Servers
- `pnpm --filter backend dev` - Start Fastify backend in development mode
- `pnpm --filter frontend dev` - Start Vite frontend development server
- `pnpm dev` - Start all development servers concurrently

### Testing
- `pnpm test` - Run all tests across workspaces
- `pnpm --filter <workspace> test` - Run tests for specific workspace
- `pnpm --filter <workspace> test:watch` - Run tests in watch mode

### Code Quality
- `pnpm lint` - Run ESLint across all workspaces
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## Architecture Overview

### Monorepo Structure
```
packages/
├── frontend/          # React + Vite + TanStack ecosystem
├── backend/           # Fastify + TypeScript API
├── shared/            # Shared types and utilities
└── database/          # Drizzle ORM schemas and migrations
```

### Backend Architecture
- **Fastify**: High-performance TypeScript web framework
- **DAO Pattern**: Data Access Objects for database abstraction
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Strict TypeScript**: Full type safety with strict compiler settings

### Frontend Architecture
- **TanStack Router**: Type-safe routing
- **TanStack Query**: Server state management
- **TanStack Form**: Form state and validation
- **TanStack Store**: Client state management
- **Vite**: Fast development and build tooling

### Database Layer
- **PostgreSQL**: Primary database with Docker containerization
- **Drizzle ORM**: Schema-first ORM with migrations
- **DAO Abstraction**: Never bypass DAO layer for direct database access

## Key Domain Models

### Core Entities
- **Envelope**: Budget category with allocated amount and spent tracking
- **Transaction**: Financial transaction linked to envelope(s)
- **Allocation**: Distribution of income across envelopes
- **Transfer**: Movement of funds between envelopes

### Business Rules
- All transactions must be assigned to envelopes
- Envelope balances = allocated - spent
- Transfers maintain system-wide balance integrity
- Income allocation distributes across multiple envelopes

## Development Guidelines

### TypeScript Standards
- Strict mode enabled across all packages
- Explicit return types for public functions
- Comprehensive error handling with typed errors
- Use discriminated unions for state management

### DAO Pattern Requirements
- All database operations must go through DAO layer
- DAOs provide abstraction over Drizzle operations
- Never import database schema directly in business logic
- Use dependency injection for DAO instances

### Testing Strategy
- Unit tests for business logic and utilities
- Integration tests for API endpoints
- Component tests for React components
- Database tests using test containers

## Current Status

Project in **Planning Phase** - foundational architecture defined, ready for implementation.

## Technical Specifications

Detailed technical specifications are organized in `.claude/specs/`:

- **`architecture.md`** - Technical stack, monorepo structure, infrastructure decisions
- **`domain-model.md`** - Cascading bucket algorithm, business logic, core entities
- **`database-schema.md`** - PostgreSQL schema, tables, relationships, migrations
- **`backend-spec.md`** - Fastify setup, DAO pattern, API architecture
- **`frontend-spec.md`** - TanStack ecosystem, React components, routing

These specifications contain the detailed architectural decisions and implementation patterns that should guide development.

## Related Files

- **`plan.md`** - Cross-session progress tracking and implementation roadmap
- **`.claude/specs/`** - Comprehensive technical specifications
- Package-specific `claude.md` files in each workspace (to be created)

## Development Best Practices

### Version Control
- Make sure that we commit often: we don't want every intermidiate change commited, but we don't want to lose significant, working implementations.