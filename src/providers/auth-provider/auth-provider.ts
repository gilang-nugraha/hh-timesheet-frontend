"use client";

import { AuthBindings } from "@refinedev/core";
import { AuthHelper } from "@refinedev/strapi-v4";
import { axiosInstance } from "@utility/axios-instance";
import { API_URL, TOKEN_KEY } from "@utility/constants";
import Cookies from "js-cookie";

const strapiAuthHelper = AuthHelper(API_URL + "/api");

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const { data, status } = await strapiAuthHelper.login(email, password);
    if (status === 200) {
      Cookies.set(TOKEN_KEY, data.jwt, {
        expires: 30, // 30 days
        path: "/",
      });

      const { data: user, status: userStatus } = await strapiAuthHelper.me(
        data.jwt,
        {
          meta: {
            populate: "role",
          },
        }
      );
      if (userStatus === 200) {
        Cookies.set("user", JSON.stringify(user), {
          expires: 30, // 30 days
          path: "/",
        });
      }

      // set header axios instance
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${data.jwt}`,
      };
      if (user?.role.name === "Manager") {
        return {
          success: true,
          redirectTo: "/employee",
        };
      } else {
        return {
          success: true,
          redirectTo: "/timesheet",
        };
      }
    }
    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },
  logout: async () => {
    Cookies.remove(TOKEN_KEY, { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      return null;
    }

    const { data, status } = await strapiAuthHelper.me(token, {
      meta: {
        populate: "role",
      },
    });
    if (status === 200) {
      const { id, username, email, role } = data;
      return {
        id,
        name: username,
        email,
        role,
      };
    }

    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
