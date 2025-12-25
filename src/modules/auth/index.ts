import { Elysia, t } from "elysia";
import { AuthModel } from "./model";
import { getExpTimeStamp } from "../../utils/util";
import { authPlugin } from "../../shared/middleware/auth_plugin";
import { initJWT } from "../../utils/jwt";
import { AuthService } from "./service";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(initJWT)
   .post(
     "/sign-in",
     async ({ body, jwt }) => {
       const result = await AuthService.signIn(body, jwt, {
         getExpTimeStamp,
         accessTokenExp: Number(Bun.env.ACCESS_TOKEN_EXP),
         refreshTokenExp: Number(Bun.env.REFRESH_TOKEN_EXP),
       });

       return result;
     },
     {
       body: AuthModel.signInBody,
       response: {
         200: AuthModel.signInResponse,
         400: AuthModel.errorMessage,
       },
     }
   )
  .post(
    "/sign-up",
    async ({ body }) => {
      const user = await AuthService.signUp(body);
      return {
        message: "Account created successfully",
        data: { user },
      };
    },
    {
      body: AuthModel.signUpBody,
      response: {
        200: AuthModel.signUpResponse,
        400: AuthModel.errorMessage,
      },
    }
  )
   .post(
     "/refresh",
     async ({ body, jwt }) => {
       const result = await AuthService.refreshToken(body.refreshToken, jwt, {
         getExpTimeStamp,
         accessTokenExp: Number(Bun.env.ACCESS_TOKEN_EXP),
         refreshTokenExp: Number(Bun.env.REFRESH_TOKEN_EXP),
       });

       return result;
     },
     {
       body: AuthModel.refreshTokenBody,
       response: {
         200: AuthModel.refreshResponse,
         401: AuthModel.errorMessage,
       },
     }
   )
   .use(authPlugin)
   .post(
     "/logout",
     async ({ user }) => {
       const res = await AuthService.logout(user.id);

       return res;
     },
     {
       auth: true,
       security: [{ bearerAuth: [] }],
       response: {
         200: AuthModel.messageResponse,
       },
     }
   );
