import { Redirect } from "@routing/handlePage";
import { Page } from "@routing/types";

export const GET: Page = ({ __c }) => {
  __c.get("session").userId = null;

  return <Redirect location="/" />;
};
