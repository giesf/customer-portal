import { Glob } from "bun";
import { writeFileSync } from "fs";
import path from "path";

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const pagesFolder = "src/pages";
const glob = new Glob(pagesFolder + "/**/*.tsx");

let buff = "";

function write(str: string) {
  buff += str + "\n";
}

async function main() {
  const imports: string[] = [];
  const routes: string[] = [];
  for await (const file of glob.scan(".")) {
    const cleanedPath = file.substring(pagesFolder.length).replace(".tsx", "");

    const cleanedPathSegments = cleanedPath.split(path.sep).map((seg) => {
      if (seg.startsWith("[")) return seg.replace("[", ":").replace("]", "");
      if (seg == "index") return "";
      else return seg;
    });

    if (cleanedPathSegments.some((a) => a.startsWith("_"))) {
      continue;
    }

    const pagePrefix = cleanedPathSegments
      .map((s) => capitalizeFirstLetter(s).replace(":", ""))
      .join("")
      .split("-")
      .join("RealDash");

    const supportedMethods = ["GET", "POST", "DELETE"];
    const mod = await import("@app/pages/" + cleanedPath);
    const modKeys = Object.keys(mod);
    const includedMethods = supportedMethods.filter((method) =>
      modKeys.includes(method),
    );
    const noAuth = cleanedPathSegments[1] != "portal";
    const importStatement = `import {${includedMethods.map((m) => m + " as " + pagePrefix + m).join(", ")}} from "@app/pages${cleanedPath}"`;
    const routeStatement = `
            ${includedMethods
              .map(
                (method) => `
app.${method.toLowerCase()}('${cleanedPathSegments.join("/")}',${noAuth ? "authOptional," : "authRequired,"} async (c) => {
    const inps = await makeInputs(c,${method == "POST" ? "true" : "false"})
    return handlePage(c,${pagePrefix + method} ,inps)
})`,
              )
              .join("\n")}
        `;

    routes.push(routeStatement);
    imports.push(importStatement);
    console.log("++Parsed ", file);
  }
  write("import {Hono} from 'hono'");
  write("import { logger } from 'hono/logger'");
  write("import { csrf } from 'hono/csrf'");
  write("import { cors } from 'hono/cors'");
  write('import { serveStatic } from "hono/bun"');
  write(
    "import { authOptional, authRequired } from '@app/infra/auth/middleware'",
  );
  write('import { initAuth } from "@app/infra/auth/init"');
  write("import {makeInputs} from '@routing/makeInputs'");
  write("import {handlePage} from '@routing/handlePage'");
  imports.forEach((s, i) => {
    console.log(`Writing imports ${i + 1}/${imports.length}`);
    write(s);
  });
  write("const app = new Hono()");
  write("app.use(logger())");
  write("app.use(csrf())");
  write("app.use(cors())");
  write("initAuth(app);");

  write(`
        
//Static Assets
app.use(
    "/assets/*",
    serveStatic({
        root: "./"
    })
)
`);

  routes.forEach((s, i) => {
    console.log(`Writing routes ${i + 1}/${imports.length}`);
    write(s);
  });
  write("export default app");

  writeFileSync("src/pages.tsx", buff);
  process.exit(0);
}

main();
