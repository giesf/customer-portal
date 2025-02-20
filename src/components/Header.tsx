import { FC } from "hono/jsx";

export const Header: FC<{ userId?: string }> = ({ userId }) => {
  return (
    <header class="container">
      <nav>
        <ul>
          <li>
            <img
              src="/assets/logo.jpg"
              alt="GIES INFORMATIONSTECHNIK"
              style="height:4.5rem;margin-right: 1rem;"
            />
            <strong>Kundenportal</strong>
          </li>
        </ul>
        {userId ? (
          <ul>
            <li>
              <a href="/sign-out">Ausloggen</a>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <a href="#">Einloggen</a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};
