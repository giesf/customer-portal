import { $ } from "bun";
import process from "process";

async function main() {
  const username = process.argv[2];
  const password = process.argv[3];

  await $`echo ${username}:${Bun.password.hashSync(password)} >> .htpasswd`;
}
main();
