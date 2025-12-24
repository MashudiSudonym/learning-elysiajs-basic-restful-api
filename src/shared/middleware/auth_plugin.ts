import { Elysia } from "elysia";
import { prismaClient } from "../../utils/prisma";
import { initJWT } from "../../utils/jwt";

export const authPlugin = new Elysia({ name: 'auth' })
  .use(initJWT)
  .macro({
    auth: {
      async resolve({ jwt, cookie: { accessToken }, status }) {
        if (!accessToken.value) {
          return status(401);
        }
        const jwtPayload = await jwt.verify(accessToken.value as string);
        if (!jwtPayload) {
          // handle error for access token is tempted or incorrect
          return status(403);
        }

        const userId = jwtPayload.sub;
        const user = await prismaClient.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          // handle error for user not found from the provided access token
          return status(403);
        }

        return {
          user,
        };
      }
    }
  });
