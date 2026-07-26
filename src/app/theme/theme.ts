import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#06323d",
        },
        secondary: {
          main: "#0e6260",
        },
        background: {
          default: "#f8fafc",
          paper: "#ffffff",
        },
      },
    },

    dark: {
      palette: {
        primary: {
          main: "#19bdba",
        },
        secondary: {
          main: "#b7dedd",
        },
        background: {
          default: "#0f172a",
          paper: "#1e293b",
        },
      },
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
  },
});
