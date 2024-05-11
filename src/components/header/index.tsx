import HeaderMenu from "@components/menu";
import { LogoutOutlined } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { useLogout } from "@refinedev/core";
import { RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import Image from "next/image";
import React from "react";

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mutate: logout } = useLogout();

  return (
    <Stack direction={"column"} style={{ backgroundColor: "white" }}>
      <AppBar position={sticky ? "sticky" : "relative"} elevation={3}>
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
              <IconButton onClick={() => logout()}>
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
