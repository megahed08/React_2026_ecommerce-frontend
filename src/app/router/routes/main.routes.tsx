import type { RouteObject } from "react-router";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",

    lazy: async () => {
      const { MainLayout } = await import("../../../layouts/MainLayout");

      return {
        Component: MainLayout,
      };
    },

    children: [
      {
        index: true,

        lazy: async () => {
          const { HomePage } = await import("../../../pages/home/HomePage");

          return {
            Component: HomePage,
          };
        },
      },

      {
        path: "products",

        handle: {
          title: "Products",
        },

        lazy: async () => {
          const { ProductsPage } =
            await import("../../../pages/products/ProductsPage");

          return {
            Component: ProductsPage,
          };
        },
      },

      {
        path: "products/:id",

        handle: {
          title: "Product details",
        },

        lazy: async () => {
          const { ProductDetailsPage } =
            await import("../../../pages/products/ProductDetailsPage");

          return {
            Component: ProductDetailsPage,
          };
        },
      },

      {
        path: "cart",

        handle: {
          title: "Cart",
        },

        lazy: async () => {
          const { CartPage } = await import("../../../pages/cart/CartPage");

          return {
            Component: CartPage,
          };
        },
      },

      {
        path: "login",

        handle: {
          title: "Log in",
        },

        lazy: async () => {
          const { LoginPage } = await import("../../../pages/auth/LoginPage");

          return {
            Component: LoginPage,
          };
        },
      },

      {
        path: "register",

        handle: {
          title: "Create account",
        },

        lazy: async () => {
          const { RegisterPage } =
            await import("../../../pages/auth/RegisterPage");

          return {
            Component: RegisterPage,
          };
        },
      },

      {
        path: "*",

        handle: {
          title: "Page not found",
        },

        lazy: async () => {
          const { NotFoundPage } =
            await import("../../../pages/not-found/NotFoundPage");

          return {
            Component: NotFoundPage,
          };
        },
      },
    ],
  },
];
