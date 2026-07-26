import type { RouteObject } from "react-router";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",

    lazy: async () => {
      const { AdminLayout } = await import("../../../layouts/AdminLayout");

      return {
        Component: AdminLayout,
      };
    },

    children: [
      {
        lazy: async () => {
          const { RequireAdmin } = await import("../guards/RequireAdmin");

          return {
            Component: RequireAdmin,
          };
        },

        children: [
          {
            index: true,

            handle: {
              title: "Product management",
            },

            lazy: async () => {
              const { AdminDashboardPage } =
                await import("../../../pages/admin/AdminDashboardPage");

              return {
                Component: AdminDashboardPage,
              };
            },
          },
        ],
      },
    ],
  },
];
