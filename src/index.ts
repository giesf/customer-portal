import { CONFIG } from "./infra/config.ts";
import app from "./pages.tsx";

export default {
  port: CONFIG.webserver.port,
  fetch: app.fetch,
};
