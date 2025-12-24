import { Elysia } from "elysia";
import { authPlugin } from "../../shared/middleware/auth_plugin";
import { UserService } from "./service";
import { UserModel } from "./model";

export const userRoutes = new Elysia({ prefix: "/api/user" })
  .use(authPlugin)
  .get("/me", async ({ user }) => {
    const result = await UserService.getMe(user.id);

    return {
      message: "User retrieved successfully",
      data: result,
    };
   }, {
    auth: true,
    response: {
      200: UserModel.meResponse,
    },
  });
