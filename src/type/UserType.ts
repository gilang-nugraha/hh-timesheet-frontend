export type UserType = {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: number | RoleType;
  rate: number;
  confirmed?: boolean;
};

export type RoleType = {
  id: string;
  name: "Authenticated" | "Manager";
};
