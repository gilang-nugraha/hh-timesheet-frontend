import Cookies from "js-cookie";

export function getUserfromClientCookies() {
  const userCookie = Cookies.get("user");
  const user = JSON.parse(userCookie || "{}");

  return user;
}

export function getUserRoleFromClientCookies() {
  const userCookie = Cookies.get("user");
  const user = JSON.parse(userCookie || "{}");
  const userRole = user ? user.role : null;
  return userRole;
}
