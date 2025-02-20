import { BaseLayout } from "@app/components/BaseLayout";
import { Header } from "@app/components/Header";
import { Page } from "@routing/types";
import fs, { readdirSync, statSync } from "fs";
export const GET: Page = async ({ userId, query }) => {
  const subdir = query.get("subdir");
  const cwd = "./downloads/" + userId + "/" + (subdir ?? "");
  const dir = readdirSync(cwd);

  const dirStats = dir.map((d) => ({
    stats: statSync(cwd + "/" + d),
    name: d,
  }));

  return (
    <BaseLayout>
      <Header userId={userId} />
      <main class="container">
        <h1>Portal</h1>
        <p>
          Sie sind als <strong>{userId ?? "ERROR"}</strong> angemeldet
        </p>
        <hr />

        <div style="display:flex;flex-direction:row; gap: 0.5rem;">
          <a href="/portal/">Meine Downloads</a>/
          {subdir
            ?.split("/")
            .filter(Boolean)
            .map((d, i) => (
              <>
                <a
                  href={
                    "/portal/?subdir=" +
                    subdir
                      .split("/")
                      .slice(0, i + 1)
                      .join("/") +
                    "/"
                  }
                >
                  {d}
                </a>
                /
              </>
            ))}
        </div>
        <hr />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Typ</th>
              <th>Erstellungsdatum</th>
            </tr>
          </thead>
          <tbody>
            {dirStats.map((d) => {
              const isDir = d.stats.isDirectory();
              return (
                <tr>
                  <td>
                    <a
                      href={
                        isDir
                          ? "/portal/?subdir=" + (subdir ?? "") + d.name + "/"
                          : "/downloads/" + (subdir ?? "") + d.name
                      }
                      target={isDir ? undefined : "_blank"}
                    >
                      {d.name}
                    </a>
                  </td>
                  <td>{isDir ? "Ordner" : "Datei"}</td>
                  <td>{new Date(d.stats.ctimeMs).toLocaleString("de", {})}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </BaseLayout>
  );
};
