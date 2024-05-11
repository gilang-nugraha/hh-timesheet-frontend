import { AccessControlProvider, CanParams } from "@refinedev/core";
import Cookies from "js-cookie";

export const aclProvider: AccessControlProvider = {
  can: async ({ resource, action }: CanParams) => {
    const userCookie = Cookies.get("user");
    const user = JSON.parse(userCookie || "{}");
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
