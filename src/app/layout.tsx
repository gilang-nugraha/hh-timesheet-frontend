import { DevtoolsProvider } from "@providers/devtools";
import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { RefineSnackbarProvider, notificationProvider } from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { ColorModeContextProvider } from "@contexts/color-mode";
import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import { aclProvider } from "@providers/acl-provider/access-control";
import { aclProviderClient } from "@providers/acl-provider/access-control.client";

export const metadata: Metadata = {
  title: "HH Timesheet",
  description: "timesheet management",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <ColorModeContextProvider defaultMode={defaultMode}>
              <RefineSnackbarProvider>
                <Refine
                  routerProvider={routerProvider}
                  authProvider={authProvider}
                  dataProvider={dataProvider}
                  accessControlProvider={aclProviderClient}
                  notificationProvider={notificationProvider}
                  resources={[
                    {
                      name: "works",
                      list: "/works",
                      options: {
                        label: "Daftar Kegiatan",
                      },
                    },
                    {
                      name: "users",
                      list: "/employee",
                      options: {
                        label: "Daftar Karyawan",
                      },
                    },
                    {
                      name: "work-time",
                      list: "/setting",
                      options: {
                        label: "Pengaturan",
                      },
                    },
                    {
                      name: "timesheet",
                      list: "/timesheet",
                      meta: {
                        hide: true,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: false,
                    useNewQueryKeys: true,
                    warnWhenUnsavedChanges: true,
                    projectId: "KwRbQT-n6AyFl-fc5n2k",
                  }}
                >
                  {children}
                  <RefineKbar />
                </Refine>
              </RefineSnackbarProvider>
            </ColorModeContextProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
