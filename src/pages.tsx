import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { authOptional, authRequired } from "@app/infra/auth/middleware";
import { initAuth } from "@app/infra/auth/init";
import { makeInputs } from "@routing/makeInputs";
import { handlePage } from "@routing/handlePage";
import { GET as SignRealDashoutGET } from "@app/pages/sign-out";
import { GET as GET, POST as POST } from "@app/pages/index";
import { GET as PortalGET } from "@app/pages/portal/index";
const app = new Hono();
app.use(csrf());
app.use(cors());
initAuth(app);

//Static Assets
app.use(
  "/assets/*",
  serveStatic({
    root: "./",
  }),
);

app.get("/sign-out", authOptional, async (c) => {
  const inps = await makeInputs(c, false);
  return handlePage(c, SignRealDashoutGET, inps);
});

app.get("/", authOptional, async (c) => {
  const inps = await makeInputs(c, false);
  return handlePage(c, GET, inps);
});

app.post("/", authOptional, async (c) => {
  const inps = await makeInputs(c, true);
  return handlePage(c, POST, inps);
});

app.get("/portal/", authRequired, async (c) => {
  const inps = await makeInputs(c, false);
  return handlePage(c, PortalGET, inps);
});

export default app;
