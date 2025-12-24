import { status } from "elysia";
import { prismaClient } from "../../utils/prisma";
import { AuthModel } from "./model";

type JwtSigner = {
  sign: (payload: any) => Promise<string>;
  verify: (token: string) => Promise<any>;
};

type TokenConfig = {
  getExpTimeStamp: (expInSeconds: number) => number;
  accessTokenExp: number;
  refreshTokenExp: number;
};

export abstract class AuthService {
  static async signUp(body: AuthModel.signUpBody) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw status(400, "User already exists" as AuthModel.errorMessage);
    }

    const hashedPassword = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const user = await prismaClient.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        isAdult: body.isAdult,
        isOnline: false,
      },
    });

    return user;
  }

  static async signIn(
    body: AuthModel.signInBody,
    jwt: JwtSigner,
    cfg: TokenConfig
  ) {
    const { getExpTimeStamp, accessTokenExp, refreshTokenExp } = cfg;

    const user = await prismaClient.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw status(400, "Credential not match" as AuthModel.errorMessage);
    }

    const matchPassword = await Bun.password.verify(
      body.password,
      user.password,
      "bcrypt"
    );

    if (!matchPassword) {
      throw status(400, "Credential not match" as AuthModel.errorMessage);
    }

    const accessToken = await jwt.sign({
      sub: user.id,
      exp: getExpTimeStamp(accessTokenExp),
    });

    const refreshToken = await jwt.sign({
      sub: user.id,
      exp: getExpTimeStamp(refreshTokenExp),
    });

    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: { isOnline: true, refreshToken: refreshToken },
    });

    return {
      message: "sign in success",
      data: {
        user: updatedUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  static async refreshToken(
    refreshTokenFromCookie: string | undefined,
    jwt: JwtSigner,
    cfg: TokenConfig
  ) {
    const { getExpTimeStamp, accessTokenExp, refreshTokenExp } = cfg;

    if (!refreshTokenFromCookie) {
      throw status(401, "Invalid token" as AuthModel.errorMessage);
    }

    const payload = await jwt.verify(refreshTokenFromCookie);

    if (!payload?.sub) {
      throw status(401, "Invalid token" as AuthModel.errorMessage);
    }

    const userId = payload.sub.toString();

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw status(401, "Invalid token" as AuthModel.errorMessage);
    }

    const accessToken = await jwt.sign({
      sub: user.id,
      exp: getExpTimeStamp(accessTokenExp),
    });

    const refreshToken = await jwt.sign({
      sub: user.id,
      exp: getExpTimeStamp(refreshTokenExp),
    });

    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: { refreshToken: refreshToken },
    });

    return {
      message: "refresh token success",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  static async logout(userId: string) {
    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        isOnline: false,
        refreshToken: null,
      },
    });

    return {
      message: "logout successfully",
    };
  }
}
