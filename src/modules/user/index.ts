import { Elysia } from "elysia";
import { authPlugin } from "../../shared/middleware/auth_plugin";
import { UserService } from "./service";
import { UserModel } from "./model";

export const userRoutes = new Elysia({ prefix: "/api/user" })
  .use(authPlugin)
  .get(
    "/me",
    async ({ user }) => {
      const result = await UserService.getMe(user.id);

      return {
        message: "User retrieved successfully",
        data: result,
      };
    },
    {
      auth: true,
      security: [{ bearerAuth: [] }],
      response: {
        200: UserModel.meResponse,
      },
    }
  )
  .patch(
    "/edit-me",
    async ({ user, body }) => {
      const result = await UserService.editMe(user.id, body);

      return {
        message: "User updated successfully",
        data: result,
      };
    },
    {
      body: UserModel.editMeBody,
      auth: true,
      security: [{ bearerAuth: [] }],
      response: {
        200: UserModel.meResponse,
      },
    }
  );
