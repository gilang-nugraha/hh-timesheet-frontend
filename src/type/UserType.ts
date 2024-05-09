export type UserType = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: RoleType;
  rate: number;
};

export type RoleType = {
  id: string;
  name: "Authenticated" | "Manager";
};
