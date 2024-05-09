import HeaderMenu from "@components/menu";
import Menu from "@components/menu";
import { ColorModeContext } from "@contexts/color-mode";
import { LogoutOutlined } from "@mui/icons-material";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { Container } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import Image from "next/image";
import React, { useContext } from "react";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);

  const { data: user } = useGetIdentity<IUser>();

  return (
    <Stack direction={"column"} style={{ backgroundColor: "white" }}>
      <AppBar position={sticky ? "sticky" : "relative"}>
        <Toolbar>
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Image
              src="/logo.png"
              width={120}
              height={50}
              layout="fixed"
              alt="logo"
            />
          </Stack>
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Stack
              direction="row"
              width="100%"
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton
                onClick={() => {
                  setMode();
                }}
              >
                <LogoutOutlined />
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <HeaderMenu />
    </Stack>
  );
};
