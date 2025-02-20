import { TOML } from "bun";
import { readFileSync } from "fs";
const configContents = readFileSync(
  Bun.env.CONFIG_FILE ?? "./config.toml",
).toString();

export const CONFIG: any = TOML.parse(configContents);
