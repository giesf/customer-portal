import { Hono } from "hono";

import assert from "../assertion";
import { verifyUser } from "./user";
import { CONFIG } from "../config";
import session from "hono-session";
import { serveStatic } from "hono/bun";
import { authRequired } from "./middleware";

export const initAuth = (app: Hono) => {
  app.use(session({ secret: CONFIG.security.auth_secret }));

  app.use("/downloads/*", authRequired, (c, next) => {
    return serveStatic({
      root: "./downloads",
      rewriteRequestPath: (path) => {
        //@ts-ignore
        const session = c.get("session") as any;
        return path.replace("downloads", session.userId ?? "-");
      },
    })(c, next);
  });
};
