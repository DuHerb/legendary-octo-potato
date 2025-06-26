# Technical Architecture Specification

## Project Overview

A modern envelope budgeting application built as a sandbox project for exploring agentic workflows with Claude Code. This project demonstrates best practices for TypeScript-first full-stack development, DAO patterns, and the complete TanStack ecosystem.

## Technical Stack

### Frontend
- **Framework**: React (Vite)
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **State Management**: TanStack Store (alpha)
- **Forms**: TanStack Form + Zod validation
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict mode)

### Backend
- **Runtime**: Node.js
- **Framework**: Fastify (TypeScript-first with excellent performance)
- **Database**: PostgreSQL (Docker for development)
- **Data Access**: DAO Pattern with Drizzle ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas (shared with frontend)
- **Language**: TypeScript (strict mode)

### Database Layer
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM (TypeScript-first, lightweight)
- **Migrations**: Drizzle Kit
- **Connection**: PostgreSQL connection pooling
- **Architecture**: DAO (Data Access Object) pattern for database abstraction

### Infrastructure
- **Monorepo**: pnpm workspaces
- **Development**: Docker Compose (PostgreSQL + optional services)
- **Containerization**: Docker for Claude Code and database
- **Version Control**: Git with GitHub CLI integration
- **CI/CD**: GitHub Actions

### AI/Agentic Tooling
- **Claude Code**: Containerized agent environment
- **MCP (Model Context Protocol)**: For structured AI interactions
- **Living Documentation**: claude.md files at multiple levels
- **Planning**: plan.md for cross-session progress tracking

## Monorepo Architecture

### Project Structure
```
envelope-budget-app/
├── apps/
│   ├── web/                    # React frontend application
│   │   ├── src/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── claude.md
│   └── api/                    # Fastify backend application
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── claude.md
├── packages/
│   ├── shared/                 # Shared types, schemas, utilities
│   │   ├── src/
│   │   ├── package.json
│   │   └── claude.md
│   ├── database/               # Database schemas, migrations, DAOs
│   │   ├── src/
│   │   │   ├── schemas/        # Drizzle schemas
│   │   │   ├── migrations/     # SQL migrations
│   │   │   ├── dao/           # Data Access Objects
│   │   │   └── types/         # Database types
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── claude.md
│   └── ui/                     # Shared UI components (optional)
│       ├── src/
│       ├── package.json
│       └── claude.md
├── tools/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── postgres.dockerfile
│   │   └── claude-code.dockerfile
│   └── scripts/
├── docs/
│   ├── claude.md
│   ├── plan.md
│   ├── mcp-config.json
│   └── commands/
├── claude.md
├── package.json               # Root package.json
├── pnpm-workspace.yaml
├── turbo.json                 # Turborepo for build optimization
└── .env.example
```

## Development Workflow

### Monorepo Benefits
- **Shared Dependencies**: Common packages shared across apps
- **Type Safety**: Shared types ensure consistency
- **Atomic Changes**: Update frontend and backend together
- **Build Optimization**: Turborepo for intelligent caching

### Claude Code Integration
1. **Containerized Environment**: Claude Code runs in isolated Docker container
2. **Multi-Agent Architecture**: Spawn specialized agents for different workspaces
3. **DAO Awareness**: Agents understand the data access patterns
4. **Type-Safe Operations**: Full TypeScript support for AI-generated code

### Quality Assurance
- TypeScript strict mode across all packages
- ESLint + Prettier configuration
- Unit tests for DAOs and services
- Integration tests for API endpoints
- E2E tests with Playwright

## Security Considerations

- JWT-based authentication with secure token handling
- Input validation with Zod schemas (shared between frontend/backend)
- SQL injection prevention through parameterized queries
- Rate limiting on API endpoints
- CORS configuration
- Environment variable management
- Database connection security

## Success Metrics

### Technical Metrics
- Full TypeScript coverage with strict mode
- Sub-100ms API response times
- Zero runtime type errors
- Comprehensive test coverage (>80%)

### Learning Objectives
- Master the complete TanStack ecosystem
- Understand DAO pattern implementation
- Experience TypeScript-first backend development
- Effective multi-agent Claude Code workflows