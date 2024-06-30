import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import { type FC, memo } from "react";
import { Layout as LayoutComponent } from "../../../components";

import "@buttery/tokens/docs/index.css";

import { bodyCSS } from "../../../components";
import { graph, header } from "./data";

const RemixNavLink: FC<JSX.IntrinsicElements["a"] & { href: string }> = memo(
  function RemixNavLink({ children, href, ...restProps }) {
    return (
      <NavLink to={href} {...restProps} end>
        {children}
      </NavLink>
    );
  }
);

export async function loader() {
  return json({
    graph: graph,
    header: header ?? null,
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body className={bodyCSS}>
        <LayoutComponent
          header={loaderData.header}
          graph={loaderData.graph}
          NavLinkComponent={RemixNavLink}
        >
          {children}
        </LayoutComponent>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}