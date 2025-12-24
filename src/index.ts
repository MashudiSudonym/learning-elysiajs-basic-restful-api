import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { userRoutes } from "./modules/user";
import { authRoutes } from "./modules/auth";

const app = new Elysia()
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Elysia Prisma JWT Auth",
          description: "Elysia Prisma JWT Auth Documentation",
          version: "1.0.0",
        },
      },
    })
  )
  .use(authRoutes)
  .use(userRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
