import { RouteGraph, routeDocs, routeIndex } from "virtual:routes";
import type {
  ButteryDocsRouteManifestEntry,
  ButteryDocsRouteManifestGraphUtils,
} from "@buttery/tools/docs";
import { Suspense, lazy, useMemo } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { LayoutBody } from "./components/LayoutBody";
import { LayoutBodyMain } from "./components/LayoutBodyMain";
import { LayoutBodyTOC } from "./components/LayoutBodyTOC";
import "@buttery/tokens/docs/css";
import type { Toc as TableOfContents } from "@stefanprobst/rehype-extract-toc";
import AppLayout from "./App.layout";
import { LayoutBodyNav } from "./components/LayoutBodyNav";

function createRoute(
  route: ButteryDocsRouteManifestEntry & {
    importComponent: () => Promise<{
      default: JSX.ElementType;
      tableOfContents: TableOfContents;
      frontmatter: Record<string, unknown>;
    }>;
  },
  options: { isDocs: boolean }
) {
  const Component = lazy(async () => {
    // Import the .(md|mdx) file as a component and collect
    // the other information that was supplied to it
    const {
      default: DocumentComponent,
      tableOfContents,
      frontmatter,
    } = await route.importComponent();

    console.log(frontmatter);

    if (!options.isDocs) {
      return {
        default: () => <DocumentComponent />,
      };
    }
    return {
      default: () => (
        <>
          <LayoutBodyMain>
            <DocumentComponent />
          </LayoutBodyMain>
          <LayoutBodyTOC tableOfContents={tableOfContents} />
        </>
      ),
    };
  });

  return {
    index: true,
    path: route.routePath,
    element: (
      <Suspense
        // We want to wait to render anything until the component is ready
        fallback={null}
      >
        <Component />
      </Suspense>
    ),
  };
}

function DocsLayout() {
  const { pathname } = useLocation();
  const graph = useMemo(() => {
    const pageRoute = pathname.split("/").filter(Boolean)[0];
    const graph = (
      RouteGraph as ButteryDocsRouteManifestGraphUtils
    ).getRouteGraphNodeByRoutePath(pageRoute);
    return graph;
  }, [pathname]);

  return (
    <LayoutBody>
      <LayoutBodyNav graph={graph} />
      <Outlet />
    </LayoutBody>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={createRoute(routeIndex, { isDocs: false }).element}
        />
        <Route element={<DocsLayout />}>
          {routeDocs.map((route) => {
            return (
              <Route
                key={route.routePath}
                {...createRoute(route, { isDocs: true })}
                index
              />
            );
          })}
        </Route>
      </Route>
    </Routes>
  );
}
