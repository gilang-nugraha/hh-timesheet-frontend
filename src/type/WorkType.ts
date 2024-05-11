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
  overtimeDuration: number;
  overtimeIncome: number;
  totalIncome: number;
  totaltimeDuration: number;
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

export type SummaryTimesheetType = {
  baseDuration: number;
  overtimeDuration: number;
  overtimeIncome: number;
  baseIncome: number;
  totalIncome: number;
  totalDuration: number;
};
