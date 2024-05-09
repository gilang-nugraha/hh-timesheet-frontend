import { Button, Stack, Typography } from "@mui/material";
import { ITreeMenu, LayoutProps, useMenu } from "@refinedev/core";
import Link from "next/link";
import React from "react";

const HeaderMenu: React.FC<LayoutProps> = ({ children }) => {
  const { menuItems, selectedKey } = useMenu();

  const renderMenuItems = (items: ITreeMenu[]) => {
    return (
      <>
        {menuItems.map(({ key, name, label, icon, route }) => {
          return (
            <Button
              key={name}
              style={{
                color: selectedKey === key ? "primary.main" : "inherit",
                fontWeight: selectedKey === key ? "bold" : "normal",
                borderBottom: selectedKey === key ? "2px solid" : "none",
                borderRadius: 0,
                textTransform: "capitalize",
              }}
              color="secondary"
              component={Link}
              href={route}
            >
              {label ?? name}
            </Button>
          );
        })}
      </>
    );
  };

  return (
    <Stack p={4}>
      <Typography variant="h4" fontWeight={800}>
        HH Timesheet
      </Typography>
      <Stack direction="row" gap={2} px={2} mt={2}>
        {renderMenuItems(menuItems)}
      </Stack>
    </Stack>
  );
};

export default HeaderMenu;
