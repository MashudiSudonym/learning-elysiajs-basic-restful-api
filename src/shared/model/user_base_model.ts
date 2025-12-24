import { t } from "elysia";

export const userBase = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  isOnline: t.Union([t.Boolean(), t.Null()]),
  isAdult: t.Boolean(),
});
export type userBase = typeof userBase.static;
