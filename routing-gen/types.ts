import { FC } from "hono/jsx";
import { NoAuthPageInputs, PageInputs } from "./makeInputs";

export type Page = FC<PageInputs>;

export type AuthlessPage = FC<NoAuthPageInputs>;
