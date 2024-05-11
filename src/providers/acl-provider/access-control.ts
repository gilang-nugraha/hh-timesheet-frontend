import { AccessControlProvider, CanParams } from "@refinedev/core";
import Cookies from "js-cookie";

export const aclProvider: AccessControlProvider = {
  can: async ({ resource, action }: CanParams) => {
    const userCookie = Cookies.get("user");
    const user = JSON.parse(userCookie || "{}");
    const userRole = user ? user.role : null;
    if (resource === "works" && userRole?.name === "Manager") {
      return {
        can: true,
      };
    }
    if (resource === "works" && userRole?.name !== "Manager") {
      return {
        can: false,
        redirectTo: `/works/show/${user?.id}`,
      };
    }

    // Otherwise, allow access
    return { can: false };
  },
};
