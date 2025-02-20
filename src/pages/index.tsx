import { BaseLayout } from "@app/components/BaseLayout";
import type { Page } from "@routing/types";
import { Header } from "@app/components/Header";
import assert from "@app/infra/assertion";
import { verifyUser } from "@app/infra/auth/user";
import { Redirect } from "@routing/handlePage";

export const GET: Page = ({ userId }) => {
  if (userId) return <Redirect location="/portal/" />;

  return (
    <BaseLayout>
      <Header />
      <main class="container" style="max-width:30rem;">
        <form method="post" action="/">
          <label>
            Kundenkennung <input name="username" />
          </label>
          <label>
            Passwort <input name="password" type="password" />
          </label>
          <button type="submit">Einloggen</button>
        </form>
      </main>
    </BaseLayout>
  );
};

export const POST: Page = async ({ body, __c }) => {
  assert(typeof body.username == "string");
  assert(typeof body.password == "string");

  const isValidUser = await verifyUser(body.username, body.password);

  if (!isValidUser) return <Redirect location="/?error=y" />;

  __c.get("session").userId = body.username;
  return <Redirect location="/portal/" />;
};
