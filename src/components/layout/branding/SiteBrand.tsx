import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import { SITE_CONFIG } from "../../../app/config/site";

interface SiteBrandProps {
  showNameOnMobile?: boolean;
  logoSize?: number;
}

const fallbackLogoPath = "/brand/logo.svg";

export function SiteBrand({
  showNameOnMobile = false,
  logoSize = 40,
}: SiteBrandProps) {
  const siteName = SITE_CONFIG.name || "Shop";

  const logoPath = SITE_CONFIG.brand.logo || fallbackLogoPath;

  return (
    <Box
      component={Link}
      to="/"
      aria-label={`${siteName} home`}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        minWidth: 0,
        color: "text.primary",
        textDecoration: "none",
      }}
    >
      <Box
        component="img"
        src={logoPath}
        alt=""
        aria-hidden="true"
        sx={(theme) => ({
          display: "block",
          width: logoSize,
          height: logoSize,
          flexShrink: 0,
          objectFit: "contain",
          filter: "none",

          transition: theme.transitions.create("filter", {
            duration: theme.transitions.duration.shorter,
          }),

          ...theme.applyStyles("dark", {
            filter: "brightness(0) invert(1)",
          }),
        })}
      />

      <Typography
        component="span"
        variant="h6"
        noWrap
        sx={{
          display: showNameOnMobile
            ? "block"
            : {
                xs: "none",
                sm: "block",
              },

          minWidth: 0,
          color: "inherit",
          fontWeight: 700,
        }}
      >
        {siteName}
      </Typography>
    </Box>
  );
}
