import { ThemedLayout } from "@components/themed-layout";
import { aclProvider } from "@providers/acl-provider/access-control";
import { aclProviderServer } from "@providers/acl-provider/access-control.server";
import { authProviderServer } from "@providers/auth-provider";
import { CanReturnType } from "@refinedev/core";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();
  const acl = await getCan();
  const { can, redirectTo } = acl;
  console.log("redirectTo", can, redirectTo);
  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }
  if (!can) {
    return redirect(redirectTo || "/login");
  }
  return <ThemedLayout>{children}</ThemedLayout>;
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
  };
}

interface CustomACLProvider extends CanReturnType {
  redirectTo?: string;
}

async function getCan() {
  const { can, redirectTo }: CustomACLProvider = await aclProviderServer.can({
    resource: "works",
    action: "list",
  });

  return {
    can,
    redirectTo,
  };
}
