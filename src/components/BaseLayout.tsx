import { FC, PropsWithChildren } from "hono/jsx";

export const BaseLayout: FC<PropsWithChildren & { title?: string }> = ({
  children,
  title = "Customer Portal",
}) => {
  return (
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="theme-color"
          content="#FFF"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="stylesheet" href="/assets/style.css"></link>
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
};
