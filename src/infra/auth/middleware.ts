import { createMiddleware } from "hono/factory";

export const authRequired = createMiddleware(async (c, next) => {
  if (!c.get("session")?.userId) return c.redirect("/");
  await next();
});

export const authOptional = createMiddleware(async (c, next) => {
  await next();
});
