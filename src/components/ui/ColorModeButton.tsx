import { useState } from "react";

import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import { useColorScheme } from "@mui/material/styles";

type ColorMode = "system" | "light" | "dark";

export function ColorModeButton() {
  const { mode, systemMode, setMode } = useColorScheme();

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  if (!mode) {
    return null;
  }

  const menuIsOpen = Boolean(anchorElement);

  const resolvedMode = mode === "system" ? systemMode : mode;

  const isDarkAppearance = resolvedMode === "dark";

  function selectMode(selectedMode: ColorMode) {
    setMode(selectedMode);
    setAnchorElement(null);
  }

  return (
    <>
      <Tooltip
        title={
          mode === "system" ? `System theme (${resolvedMode})` : `${mode} theme`
        }
      >
        <IconButton
          color="primary"
          aria-label="Choose color theme"
          aria-controls={menuIsOpen ? "color-mode-menu" : undefined}
          aria-haspopup="menu"
          aria-expanded={menuIsOpen}
          onClick={(event) => {
            setAnchorElement(event.currentTarget);
          }}
        >
          {isDarkAppearance ? (
            <DarkModeRoundedIcon />
          ) : (
            <LightModeRoundedIcon />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        id="color-mode-menu"
        anchorEl={anchorElement}
        open={menuIsOpen}
        onClose={() => {
          setAnchorElement(null);
        }}
      >
        <MenuItem
          selected={mode === "system"}
          onClick={() => selectMode("system")}
        >
          <ListItemIcon>
            <ComputerRoundedIcon />
          </ListItemIcon>

          <ListItemText>System</ListItemText>
        </MenuItem>

        <MenuItem
          selected={mode === "light"}
          onClick={() => selectMode("light")}
        >
          <ListItemIcon>
            <LightModeRoundedIcon />
          </ListItemIcon>

          <ListItemText>Light</ListItemText>
        </MenuItem>

        <MenuItem selected={mode === "dark"} onClick={() => selectMode("dark")}>
          <ListItemIcon>
            <DarkModeRoundedIcon />
          </ListItemIcon>

          <ListItemText>Dark</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
