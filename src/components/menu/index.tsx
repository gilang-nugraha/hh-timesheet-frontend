import { ListOutlined } from "@mui/icons-material";
import { Button, MenuItem, Stack, Typography } from "@mui/material";
import {
  CanAccess,
  ITreeMenu,
  LayoutProps,
  useCan,
  useMenu,
} from "@refinedev/core";
import Link from "next/link";
import React, { Fragment } from "react";

interface MenuProps {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  route?: string;
  selectedKey?: string;
}

const CustomMenuItem = ({ name, label, route, selectedKey }: MenuProps) => {
  return (
    <Button
      style={{
        color: selectedKey === route ? "primary.main" : "inherit",
        fontWeight: selectedKey === route ? "bold" : "normal",
        borderBottom: selectedKey === route ? "2px solid" : "none",
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
};

const HeaderMenu: React.FC<LayoutProps> = ({ children }) => {
  const { menuItems, selectedKey } = useMenu();

  return (
    <Stack p={4}>
      <Typography variant="h4" fontWeight={800}>
        HH Timesheet
      </Typography>
      <Stack direction="row" gap={2} px={2} mt={2}>
        {menuItems.map((item) => (
          <CanAccess
            key={item.key}
            resource={item.name.toLowerCase()}
            action="list"
            params={{ resource: item }}
            fallback={<Fragment />}
          >
            <CustomMenuItem
              name={item.key}
              label={item.label}
              route={item.route}
              selectedKey={selectedKey}
            />
          </CanAccess>
        ))}
      </Stack>
    </Stack>
  );
};

export default HeaderMenu;
