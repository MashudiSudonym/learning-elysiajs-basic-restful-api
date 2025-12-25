import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { userRoutes } from "./modules/user";
import { authRoutes } from "./modules/auth";

// Environment validation
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'ACCESS_TOKEN_EXP', 'REFRESH_TOKEN_EXP'];
for (const env of requiredEnv) {
  if (!Bun.env[env]) {
    throw new Error(`Environment variable ${env} is required`);
  }
}

export const app = new Elysia()
  .use(
    openapi({
      path: "/docs",
      documentation: {
        info: {
          title: "Elysia Prisma JWT Auth",
          description: "Elysia Prisma JWT Auth Documentation",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    })
  )
  .onRequest(({ request }) => {
    console.log(`${request.method} ${request.url}`);
  })
  .onAfterHandle(({ request, set }) => {
    console.log(`${request.method} ${request.url} - ${set.status}`);
  })
  .use(authRoutes)
  .use(userRoutes)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return { message: 'Validation error', details: error.message };
      case 'NOT_FOUND':
        set.status = 404;
        return { message: 'Endpoint not found' };
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500;
        return { message: 'Internal server error' };
      default:
        set.status = 500;
        return { message: 'Something went wrong' };
    }
  });

if (import.meta.main) {
  app.listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}
