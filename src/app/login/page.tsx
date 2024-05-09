import { AuthPage } from "@components/auth-page";
import { authProviderServer } from "@providers/auth-provider";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return (
    <AuthPage
      type="login"
      forgotPasswordLink={<div />}
      registerLink={<div />}
      title={<Image src="/logo.png" alt="logo" width={120} height={50} />}
    />
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
