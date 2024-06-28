import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
} from "@remix-run/react";
import './index.css'
import { LoaderFunctionArgs } from "@remix-run/node";
import { getTheme } from "./lib/theme.server";
import { ClientHintCheck, getHints, useNonce, useTheme } from "./lib/client-hints";
import clsx from "clsx";

export const loader = async ({ request }: LoaderFunctionArgs) => {

  return json(
    {
      requestInfo: {
        hints: getHints(request),
        userPrefs: {
          theme: getTheme(request),
        },
      },
    }
  );
};


export default function App() {
  const theme = useTheme();
  const nonce = useNonce();
  
  return (
    <html lang="es" className={clsx(theme)}>
      <head>
      <ClientHintCheck nonce={nonce} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/brand/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
