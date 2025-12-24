import { Elysia } from "elysia";
import { authPlugin } from "../../utils/auth_plugin";
import { UserService } from "./service";

export const userRoutes = new Elysia({ prefix: "/api/user" })
  .use(authPlugin)
  .get("/me", async ({ user, set }) => {
    if (!user.id) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    const result = await UserService.getMe(user.id);

    return result;
  });
