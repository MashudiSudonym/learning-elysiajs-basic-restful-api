# AGENTS.md for elysia-prisma-jwt-auth

## Project Overview
This is a full-stack authentication and user management API using ElysiaJS, TypeScript, Bun runtime, and Prisma ORM with PostgreSQL. Features Bearer JWT authentication with access and refresh tokens, modular architecture, OpenAPI docs, and comprehensive testing.

## Key Features
- Bearer JWT Authentication (Access + Refresh Tokens)
- User registration, login, logout, token refresh
- Protected user profile endpoints
- Global error handling and logging
- Unit/integration tests with Bun.test
- OpenAPI documentation with Bearer security schemes
- Environment validation and security best practices

## Build/Lint/Test Commands
- **Dev server**: `bun run dev` (runs with --watch)
- **Build**: No build script; uses Bun runtime directly
- **Lint**: No linting configured (no eslint or similar)
- **Test**: `bun run test` (runs all tests in test/ folder)
- **Run single test**: `bun test test/auth.test.ts`
- **Prisma**: `bunx prisma generate` (generate client), `bunx prisma migrate dev` (migrations), `bunx prisma studio` (DB GUI)

## Code Style Guidelines
- **Imports**: Group by library first (e.g., elysia), then local relative imports. Use relative paths with ../../
- **Formatting**: No formatter configured; follow consistent indentation (2 spaces), semicolons optional
- **Types**: Strict TypeScript enabled; use Elysia's `t` for schemas and validation; explicit types for params
- **Naming**: camelCase for variables/functions, PascalCase for classes/types, kebab-case for routes/files
- **Error Handling**: Use global error handler in index.ts; throw `status(code, message)` from elysia; typed error messages
- **Async**: Prefer async/await; static methods in services; modular structure with index/model/service per module
- **Security**: Use Bun.password for hashing; Bearer tokens in Authorization header; validate inputs with schemas; environment validation
- **Database**: Prisma with PostgreSQL; use prismaClient from utils; select specific fields; no refreshToken storage for Bearer
- **Environment**: Use Bun.env for secrets; required vars: DATABASE_URL, JWT_SECRET, ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP
- **Testing**: Use Bun.test; place tests in test/ folder; mock or use separate test DB if needed
- **Logging**: Manual logging in index.ts for requests/responses

## Project Structure
```
/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication module
│   │   │   ├── index.ts   # Routes
│   │   │   ├── service.ts # Business logic
│   │   │   └── model.ts   # Schemas
│   │   └── user/          # User module
│   ├── shared/
│   │   ├── middleware/auth_plugin.ts # Auth middleware with Bearer
│   │   └── model/user_base_model.ts # Shared schemas
│   ├── utils/             # JWT, Prisma, utilities
│   └── index.ts           # App setup, routes, error handling, logging
├── test/                  # Test files (moved from src/__tests__)
├── prisma/                # DB schema and migrations
├── AGENTS.md              # This file
└── README.md              # Full documentation with API examples
```

## Recent Changes
- Converted from cookie-based to Bearer token authentication
- Added @elysiajs/bearer plugin for token extraction
- Implemented global error handler and logging
- Added comprehensive tests with Bun.test
- Updated OpenAPI docs with Bearer security schemes
- Moved test folder outside src/ for better structure
- Enhanced README with API usage examples

No Cursor or Copilot rules found.