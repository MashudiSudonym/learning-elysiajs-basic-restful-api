import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { getExpTimeStamp } from "../../utils/util";
import { authPlugin } from "../../utils/auth_plugin";
import { initJWT } from "../../utils/jwt";
import { AuthService } from "./service";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(initJWT)
  .post(
    "/sign-in",
    async ({ body, jwt, cookie: { accessToken, refreshToken } }) => {
      const result = await AuthService.signIn(body, jwt, {
        getExpTimeStamp,
        accessTokenExp: Number(Bun.env.ACCESS_TOKEN_EXP),
        refreshTokenExp: Number(Bun.env.REFRESH_TOKEN_EXP),
      });

      accessToken.set({
        value: result.data.accessToken,
        httpOnly: true,
        path: "/",
        maxAge: Number(Bun.env.ACCESS_TOKEN_EXP),
      });

      refreshToken.set({
        value: result.data.refreshToken,
        httpOnly: true,
        path: "/",
        maxAge: Number(Bun.env.REFRESH_TOKEN_EXP),
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
    async ({ cookie: { accessToken, refreshToken }, jwt, set }) => {
      const oldRefresh = refreshToken.value as string;

      if (!oldRefresh) {
        set.status = 401;
        return "Invalid token" as AuthModel.errorMessage;
      }

      const result = await AuthService.refreshToken(oldRefresh, jwt, {
        getExpTimeStamp,
        accessTokenExp: Number(Bun.env.ACCESS_TOKEN_EXP),
        refreshTokenExp: Number(Bun.env.REFRESH_TOKEN_EXP),
      });

      accessToken.set({
        value: result.data.accessToken,
        httpOnly: true,
        path: "/",
        maxAge: Number(Bun.env.ACCESS_TOKEN_EXP),
      });

      refreshToken.set({
        value: result.data.refreshToken,
        httpOnly: true,
        path: "/",
        maxAge: Number(Bun.env.REFRESH_TOKEN_EXP),
      });

      return result;
    },
    {
      response: {
        200: AuthModel.refreshResponse,
        401: AuthModel.errorMessage,
      },
    }
  )
  .use(authPlugin)
  .post(
    "/logout",
    async ({ cookie: { accessToken, refreshToken }, user }) => {
      accessToken.remove();
      refreshToken.remove();

      const res = await AuthService.logout(user.id);

      return res;
    },
    {
      auth: true,
      response: {
        200: AuthModel.messageResponse,
      },
    }
  );
