import { ProjectType } from "./ProjectType";
import { UserType } from "./UserType";

export type WorkType = {
  id: string;
  name: string;
  employee: UserType;
  project: ProjectType;
  startDate: string;
  endDate: string;
};
