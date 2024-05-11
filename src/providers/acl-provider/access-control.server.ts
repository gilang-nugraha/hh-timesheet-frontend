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

    if (resource === "works" && userRole?.name === "Manager") {
      return {
        can: true,
        redirectTo: undefined,
      };
    }
    if (resource === "works" && userRole?.name !== "Manager") {
      return {
        can: false,
        redirectTo: `/timesheet`,
      };
    }

    // Otherwise, allow access
    return { can: false, redirectTo: undefined };
  },
};
