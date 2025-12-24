import { t } from "elysia";

export const userBase = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  isOnline: t.Boolean(),
  isAdult: t.Boolean(),
});
export type userBase = typeof userBase.static;
