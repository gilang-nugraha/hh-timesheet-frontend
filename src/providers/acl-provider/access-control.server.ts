import {
  AccessControlProvider,
  CanParams,
  CanReturnType,
} from "@refinedev/core";
import { cookies } from "next/headers";

interface CustomACLProvider extends CanReturnType {
  redirectTo?: string;
}

export const aclProviderServer: AccessControlProvider = {
  can: async ({ resource, action }: CanParams): Promise<CustomACLProvider> => {
    const cookieStore = cookies();
    const userCookie = cookieStore.get("user");
    const user = JSON.parse(userCookie?.value || "{}");
    const userRole = user ? user.role : null;

    //allow ACL for Manager
    if (
      (resource === "works" && userRole?.name === "Manager") ||
      (resource === "users" && userRole?.name === "Manager") ||
      (resource === "work-time" && userRole?.name === "Manager")
    ) {
      return {
        can: true,
        redirectTo: undefined,
      };
    }

    //allow ACL for Employee
    if (
      (resource === "user-setting" && userRole?.name !== "Manager") ||
      (resource === "timesheet" && userRole?.name !== "Manager")
    ) {
      return {
        can: true,
        redirectTo: undefined,
      };
    }
    // Otherwise, disable access
    return { can: false, redirectTo: undefined };
  },
};
