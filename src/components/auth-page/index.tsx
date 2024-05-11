"use client";
import { Typography } from "@mui/material";
import type { AuthPageProps } from "@refinedev/core";
import { AuthPage as AuthPageBase } from "@refinedev/mui";

export const AuthPage = (props: AuthPageProps) => {
  return (
    <AuthPageBase
      {...props}
      formProps={{
        defaultValues: {
          email: "admin@demo.com",
          password: "Password123",
        },
      }}
      renderContent={(content: React.ReactNode, title: React.ReactNode) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {title}
            <Typography variant="body1">
              login Admin : admin@demo.com / Password123
            </Typography>
            <Typography variant="body1">
              login User : testuser@gmail.com / Password123
            </Typography>
            {content}
          </div>
        );
      }}
    />
  );
};
