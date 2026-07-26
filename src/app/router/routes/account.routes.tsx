import type { RouteObject } from "react-router";

export const accountRoutes: RouteObject[] = [
  {
    lazy: async () => {
      const { RequireAuth } = await import("../guards/RequireAuth");

      return {
        Component: RequireAuth,
      };
    },

    children: [
      {
        path: "/account",

        lazy: async () => {
          const { AccountLayout } =
            await import("../../../layouts/AccountLayout");

          return {
            Component: AccountLayout,
          };
        },

        children: [
          {
            index: true,

            handle: {
              title: "Account",
            },

            lazy: async () => {
              const { AccountPage } =
                await import("../../../pages/account/AccountPage");

              return {
                Component: AccountPage,
              };
            },
          },

          {
            path: "profile",

            handle: {
              title: "Profile",
            },

            lazy: async () => {
              const { ProfilePage } =
                await import("../../../pages/account/ProfilePage");

              return {
                Component: ProfilePage,
              };
            },
          },

          {
            path: "orders",

            handle: {
              title: "Orders",
            },

            lazy: async () => {
              const { OrdersPage } =
                await import("../../../pages/account/OrdersPage");

              return {
                Component: OrdersPage,
              };
            },
          },

          {
            path: "orders/:orderId",

            handle: {
              title: "Order details",
            },

            lazy: async () => {
              const { OrderDetailsPage } =
                await import("../../../pages/orders/OrderDetailsPage");

              return {
                Component: OrderDetailsPage,
              };
            },
          },
        ],
      },
    ],
  },
];
