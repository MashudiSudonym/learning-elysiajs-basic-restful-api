import { prismaClient } from "../../utils/prisma";
import { UserModel } from "./model";
import { status } from "elysia";

export abstract class UserService {
  static async getMe(userId: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw status(401, "Unauthorized" as UserModel.errorMessage);
    }

    return user;
  }
}
