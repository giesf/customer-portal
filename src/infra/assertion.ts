import nativeAssert from "assert"
import { HTTPException } from "hono/http-exception"

export default function assert(
    value: unknown,
    message?: string | Error
): asserts value {
    nativeAssert(
        value,
        new HTTPException(400, {
            message: typeof message == "string" ? message : message?.message,
        })
    )
}