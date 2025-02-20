import { Context } from "hono";
import { BlankInput } from "hono/types";

export type HelperFunctions = {
  pushURL: (url: string) => void;
  hxTrigger: (event: string) => void;
  hxSwap: (swap: string) => void;
  setSuccessMessage: (msg: string) => void;
  hxRetarget: (target: string) => void;
};

export type PageInputs = {
  params: Record<string, string>;
  body: Record<string, string[] | string>;
  query: URLSearchParams;
  headers: Headers;
  helpers: HelperFunctions;
  userId: string;
  __c: Context<any, string, BlankInput>;
};
export type NoAuthPageInputs = Omit<PageInputs, "userId">;
export async function makeInputs(
  c: Context<any, string, BlankInput>,
  isPost: boolean,
): Promise<PageInputs> {
  const params: Record<string, string> = c.req.param();

  const isJSON = c.req.header("Content-Type") == "application/json";

  const body: Record<string, string[] | string> =
    isPost && !isJSON ? await c.req.parseBody({ all: true }) : {};

  const query: URLSearchParams = new URL(c.req.url).searchParams;
  const headers: Headers = c.req.raw.headers;
  const helpers: HelperFunctions = {
    hxTrigger: (event: string) => c.header("HX-Trigger", event),
    hxRetarget: (target: string) => c.header("HX-Retarget", target),
    hxSwap: (target: string) => c.header("HX-Swap", target),
    pushURL: (url: string) => {
      let pushURL = url;
      if (url.length == 0) pushURL = c.req.path;
      if (url.startsWith("?")) pushURL = c.req.path + url;
      c.header("HX-Push-Url", pushURL);
    },
    setSuccessMessage: (msg: string) =>
      c.header("HX-Success-Message", btoa(msg)),
  };
  const userId = c.get("session").userId;
  return {
    params,
    body,
    query,
    headers,
    userId,
    helpers,
    __c: c,
  };
}
