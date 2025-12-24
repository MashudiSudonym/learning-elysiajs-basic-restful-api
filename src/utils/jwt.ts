import { jwt } from "@elysiajs/jwt";

export const initJWT = jwt({
  name: Bun.env.JWT_NAME!,
  secret: Bun.env.JWT_SECRET!,
});
