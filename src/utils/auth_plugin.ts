import { Elysia } from "elysia";
import { prismaClient } from "./prisma";
import { initJWT } from "./jwt";

export const authPlugin = (app: Elysia) =>
  app.use(initJWT).derive(async ({ jwt, cookie: { accessToken }, set }) => {
    if (!accessToken.value) {
      set.status = "Unauthorized";
      throw new Error("Token not found");
    }
    const jwtPayload = await jwt.verify(accessToken.value as string);
    if (!jwtPayload) {
      // handle error for access token is tempted or incorrect
      set.status = "Forbidden";
      throw new Error("Access token is invalid");
    }

    const userId = jwtPayload.sub;
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      // handle error for user not found from the provided access token
      set.status = "Forbidden";
      throw new Error("Access token is invalid");
    }

    return {
      user,
    };
  });
