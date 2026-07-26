import { Outlet } from "react-router";

import { DocumentTitleManager } from "./DocumentTitleManager";

export function RootRoute() {
  return (
    <>
      <DocumentTitleManager />

      <Outlet />
    </>
  );
}
