import { readFileSync } from "fs";

const HTPASSWD_PATH = "./.htpasswd";

function loadPasswd(): [string, string][] {
  return readFileSync(HTPASSWD_PATH)
    .toString()
    .split("\n")
    .map((l) => {
      const splitIndex = l.indexOf(":");

      return [l.substring(0, splitIndex), l.substring(splitIndex + 1)];
    });
}
let htpasswd = loadPasswd();

setInterval(async () => {
  htpasswd = loadPasswd();
}, 15000);

export const verifyUser = async (username: string, password: string) => {
  const user = htpasswd.find((l) => l[0] == username);
  if (!user) return false;
  const [, passwordHash] = user;
  const isValid = await Bun.password.verify(password, passwordHash);
  return isValid;
};
