import { t } from "elysia";
import { userBase } from "../../shared/model/user_base_model";

export namespace AuthModel {
  // Request Body
  export const signUpBody = t.Object({
    name: t.String({ maxLength: 60, minLength: 1 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
    isAdult: t.Boolean(),
  });
  export type signUpBody = typeof signUpBody.static;

  export const signInBody = t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
  });
  export type signInBody = typeof signInBody.static;

  export const refreshTokenBody = t.Object({ refreshToken: t.String() });
  export type refreshTokenBody = typeof refreshTokenBody.static;

  export const forgotPasswordBody = t.Object({
    email: t.String({ format: "email" }),
  });
  export type forgotPasswordBody = typeof forgotPasswordBody.static;

  // Response DTO
  export const authToken = t.Object({
    accessToken: t.String(),
    refreshToken: t.String(),
  });
  export type authToken = typeof authToken.static;

  export const signInResponse = t.Object({
    message: t.String(),
    data: t.Object({
      user: userBase,
      accessToken: t.String(),
      refreshToken: t.String(),
    }),
  });
  export type signInResponse = typeof signInResponse.static;

  export const signUpResponse = t.Object({
    message: t.String(),
    data: t.Object({
      user: userBase,
    }),
  });
  export type signUpResponse = typeof signUpResponse.static;

  export const messageResponse = t.Object({
    message: t.String(),
  });
  export type messageResponse = typeof messageResponse.static;

  export const refreshResponse = t.Object({
    message: t.String(),
    data: t.Object({
      accessToken: t.String(),
      refreshToken: t.String(),
    }),
  });
  export type refreshResponse = typeof refreshResponse.static;

  // Error Message
  export const errorMessage = t.Union([
    t.Literal("Credential not match"),
    t.Literal("User already exists"),
    t.Literal("Invalid token"),
    t.Literal("Unauthorized"),
  ]);
  export type errorMessage = typeof errorMessage.static;
}
