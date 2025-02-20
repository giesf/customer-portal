import assert from "@app/infra/assertion"
import { Context } from "hono"
import { FC } from "hono/jsx"
import { BlankInput } from "hono/types"
import { PageInputs } from "./makeInputs"
import { Page } from "./types"

const redirectKeyword = "REDIRECT:"
export async function handlePage(
    c: Context<any, string, BlankInput>,
    PageToHandle: Page,
    inputs: PageInputs
) {
    const renderedPage = await (await (<PageToHandle {...inputs} />)).toString()
    if (renderedPage.startsWith("<p>" + redirectKeyword)) {
        return handleRedirect(c, renderedPage)
    }
    return c.html(renderedPage)
}
function handleRedirect(
    c: Context<any, string, BlankInput>,
    redirectString: string
) {
    const redirect = JSON.parse(
        redirectString
            .split("<p>")
            .join("")
            .split("</p>")
            .join("")
            .substring(redirectKeyword.length)
    )
    assert(typeof redirect.location == "string")
    assert(typeof redirect.status == "number")
    return c.redirect(redirect.location, redirect.status)
}

export const Redirect: FC<{ location: string; status?: number }> = ({
    location,
    status = 302,
}) => {
    const loc = location
    return (
        <p
            dangerouslySetInnerHTML={{
                __html:
                    redirectKeyword + JSON.stringify({ location: loc, status }),
            }}
        />
    )
}
