import type { RouteObject } from "react-router";

export const checkoutRoutes: RouteObject[] = [
  {
    lazy: async () => {
      const { RequireAuth } = await import("../guards/RequireAuth");

      return {
        Component: RequireAuth,
      };
    },

    children: [
      {
        lazy: async () => {
          const { CheckoutLayout } =
            await import("../../../layouts/CheckoutLayout");

          return {
            Component: CheckoutLayout,
          };
        },

        children: [
          {
            path: "checkout",

            handle: {
              title: "Checkout",
            },

            lazy: async () => {
              const { CheckoutPage } =
                await import("../../../pages/checkout/CheckoutPage");

              return {
                Component: CheckoutPage,
              };
            },
          },

          {
            path: "orders/:orderId/confirmation",

            handle: {
              title: "Order confirmation",
            },

            lazy: async () => {
              const { OrderSuccessPage } =
                await import("../../../pages/orders/OrderSuccessPage");

              return {
                Component: OrderSuccessPage,
              };
            },
          },
        ],
      },
    ],
  },
];
