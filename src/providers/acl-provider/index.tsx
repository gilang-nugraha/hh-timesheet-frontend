"use client";

import { AccessControlProvider, CanParams } from "@refinedev/core";
import Cookies from "js-cookie";

export const aclProvider: AccessControlProvider = {
  can: async ({ resource, action }: CanParams) => {
    const user = Cookies.get("user");
    const userRole = user ? JSON.parse(user).role : null;
    if (resource === "users" && userRole !== "manager") {
      return {
        can: false,
        reason: "Unauthorized",
      };
    }

    // Otherwise, allow access
    return { can: true };
  },
};
