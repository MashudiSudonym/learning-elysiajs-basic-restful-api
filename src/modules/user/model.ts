import { t } from "elysia";
import { userBase } from "../../shared/model/user_base_model";

export namespace UserModel {
  // Response DTO
  export const meResponse = t.Object({
    message: t.String(),
    data: userBase,
  });
  export type meResponse = typeof meResponse.static;

  // Error Message
  export const errorMessage = t.Union([t.Literal("Invalid token"), t.Literal("Unauthorized")]);
  export type errorMessage = typeof errorMessage.static;
}
