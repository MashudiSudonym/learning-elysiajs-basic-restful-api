import { Elysia } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { prismaClient } from "../../utils/prisma";
import { initJWT } from "../../utils/jwt";

export const authPlugin = new Elysia({ name: 'auth' })
  .use(initJWT)
  .use(bearer())
  .macro({
    auth: {
      async resolve({ jwt, bearer, status }) {
        if (!bearer) {
          return status(401);
        }
        const jwtPayload = await jwt.verify(bearer);
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

        if (!user.isOnline) {
          // handle logout: token invalidated after logout
          return status(401);
        }

        return {
          user,
        };
      }
    }
  });
