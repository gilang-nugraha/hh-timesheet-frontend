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
      resource === "works" ||
      resource === "users" ||
      resource === "work-time" ||
      (resource === "timesheet" && userRole?.name === "Manager")
    ) {
      console.log("aclhere3");

      return {
        can: true,
        redirectTo: undefined,
      };
    }

    //disallow ACL for Employee
    if (resource === "works" && userRole?.name !== "Manager") {
      console.log("aclhere");

      return {
        can: false,
        redirectTo: undefined,
      };
    }
    //ACL for Employee
    if (
      resource === "timesheet" ||
      (resource === "user-setting" && userRole?.name !== "Manager")
    ) {
      console.log("aclhere2");

      return {
        can: true,
        redirectTo: undefined,
      };
    }

    // Otherwise, disable access
    return { can: false, redirectTo: undefined };
  },
};
