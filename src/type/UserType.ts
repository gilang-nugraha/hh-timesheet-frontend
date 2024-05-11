export type UserType = {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: number | RoleType;
  rate: number;
  confirmed?: boolean;
};
export type UserRequestType = {
  id?: string;
  username: string;
  password?: string;
  rate: number;
};
export type RoleType = {
  id: string;
  name: "Authenticated" | "Manager";
};
