import { ProjectType } from "./ProjectType";
import { SettingType } from "./SettingType";
import { UserType } from "./UserType";

export type WorkType = {
  id?: string;
  name: string;
  employee: UserType;
  project: ProjectType | string;
  startDate: string;
  endDate: string;
  setting: SettingType;
  duration: number;
  income: number;
  overTimeIncome: number;
  overtimeDuration: number;
  overtimeIncome: number;
  totalIncome: number;
  totalTimeDuration: number;
  startTime?: string;
  endTime?: string;
  employeeRate?: number;
};

export type WorkTypeRequest = {
  name: string;
  employee: string;
  project: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  employeeRate?: number;
};
