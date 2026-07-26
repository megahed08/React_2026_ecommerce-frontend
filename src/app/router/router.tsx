import { createBrowserRouter } from "react-router";

import { RootRoute } from "./RootRoute";
import { accountRoutes } from "./routes/account.routes";
import { adminRoutes } from "./routes/admin.routes";
import { checkoutRoutes } from "./routes/checkout.routes";
import { mainRoutes } from "./routes/main.routes";

export const router = createBrowserRouter([
  {
    Component: RootRoute,

    children: [
      ...mainRoutes,
      ...checkoutRoutes,
      ...accountRoutes,
      ...adminRoutes,
    ],
  },
]);
