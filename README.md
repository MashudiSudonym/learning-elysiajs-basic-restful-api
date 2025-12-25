# Elysia Prisma JWT Auth

A full-stack authentication and user management API built with ElysiaJS, Prisma, and PostgreSQL, featuring JWT-based authentication with access and refresh tokens.

## Features

- 🔐 JWT Authentication (Access + Refresh Tokens)
- 👤 User Registration and Login
- 🔄 Token Refresh
- 🚪 Secure Logout
- 📚 OpenAPI Documentation
- 🗄️ PostgreSQL Database with Prisma ORM
- ⚡ Built with Bun runtime

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Node.js](https://nodejs.org/) (optional, for Prisma CLI if not using Bun)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd elysia-prisma-jwt-auth
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_NAME="auth-jwt"

# Token Expiration (in seconds)
ACCESS_TOKEN_EXP=3600
REFRESH_TOKEN_EXP=604800
```

### 4. Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE your_database_name;
   ```

2. **Run Prisma Migrations**
   ```bash
   bunx prisma migrate dev
   ```

3. **Generate Prisma Client**
   ```bash
   bunx prisma generate
   ```

### 5. Start Development Server

```bash
bun run dev
```

The server will start at `http://localhost:3000`

## API Documentation

Once the server is running, visit `http://localhost:3000/docs` to access the interactive API documentation powered by OpenAPI.

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/user/me` - Get current user profile (requires authentication)

## API Usage Examples

### 1. Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "isAdult": true
  }'
```

**Response:**
```json
{
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "cmjkxjtt60000dam69qpi4fg5",
      "name": "John Doe",
      "email": "john@example.com",
      "isOnline": false,
      "isAdult": true
    }
  }
}
```

### 2. Sign In
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

**Response:**
```json
{
  "message": "sign in success",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Get User Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/user/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response:**
```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": "cmjkxjtt60000dam69qpi4fg5",
    "name": "John Doe",
    "email": "john@example.com",
    "isOnline": true,
    "isAdult": true
  }
}
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Response:**
```json
{
  "message": "refresh token success",
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 5. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response:**
```json
{
  "message": "logout successfully"
}
```

## Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication module
│   │   ├── index.ts   # Auth routes/controller
│   │   ├── service.ts # Business logic
│   │   └── model.ts   # Request/Response schemas
│   ├── user/          # User management module
│   │   ├── index.ts   # User routes/controller
│   │   ├── service.ts # Business logic
│   │   └── model.ts   # Request/Response schemas
│   └── shared/        # Shared modules
│       ├── middleware/
│       │   └── auth_plugin.ts # Authentication middleware
│       └── model/
│           └── user_base_model.ts # Shared user schema
├── utils/
│   ├── jwt.ts         # JWT utilities
│   ├── prisma.ts      # Database client
│   └── util.ts        # Utility functions
└── index.ts           # Main application entry
prisma/
├── migrations/        # Database migrations
├── schema.prisma      # Prisma schema
└── prisma.config.ts   # Prisma configuration
```

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bunx prisma studio` - Open Prisma Studio for database management
- `bunx prisma migrate dev` - Create and apply database migrations
- `bunx prisma generate` - Generate Prisma client

## Technologies Used

- **Framework**: [ElysiaJS](https://elysiajs.com/) - Fast, type-safe web framework
- **Runtime**: [Bun](https://bun.sh/) - Next-generation JavaScript runtime
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) - Type-safe database access
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Elysia Type System
- **Documentation**: OpenAPI/Swagger

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.</content>
<parameter name="filePath">README.md