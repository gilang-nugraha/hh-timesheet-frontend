import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Calculate the duration between two time Date objects in milliseconds
export const calculateDuration = (startDate: Dayjs, endDate: Dayjs) => {
  return endDate.diff(startDate, "milliseconds");
};

// Format milliseconds to HH:MM
export const formatMillisecondsToHHMM = (milliseconds: number) => {
  const durationObj = dayjs.duration(milliseconds);
  const hours = Math.floor(durationObj.asHours());
  const minutes = durationObj.minutes();
  return dayjs()
    .startOf("day")
    .add(hours, "hours")
    .add(minutes, "minutes")
    .format("HH:mm");
};

// Format miliseconds to minutes decimal
export const formatMillisecondsToMinutes = (milliseconds: number) => {
  const durationObj = dayjs.duration(milliseconds);
  return durationObj.minutes() + durationObj.seconds() / 60;
};

// Format miliseconds to hour decimal
export const formatMillisecondsToHours = (milliseconds: number) => {
  const durationObj = dayjs.duration(milliseconds);
  return durationObj.hours() + durationObj.minutes() / 60;
};

// Format to Indonesia Time
export const formatToIndonesianTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const hourText = hours > 0 ? `${hours} jam` : "";
  const minuteText = minutes > 0 ? `${minutes} menit` : "";
  const separator = hours > 0 && minutes > 0 ? " " : "";
  return `${hourText}${separator}${minuteText}`;
};

// Calculate the duration between two time Date objects in minutes
export function calculateDurationInSettingRange(
  startDate: Dayjs,
  endDate: Dayjs,
  settingStartTime: Dayjs,
  settingEndTime: Dayjs
) {
  if (startDate.isBefore(settingStartTime)) {
    return calculateDuration(settingStartTime, endDate);
  } else if (endDate.isAfter(settingEndTime)) {
    return calculateDuration(startDate, settingEndTime);
  } else {
    return calculateDuration(startDate, endDate);
  }
}

//check if startDate and endDate time have out of setting timeRange
export function isOutOfSettingTimeRange(
  startDate: Dayjs,
  endDate: Dayjs,
  settingStartTime: Dayjs,
  settingEndTime: Dayjs
) {
  const stringSettingStartTime = settingStartTime.format("HH:mm");
  const stringSettingEndTime = settingEndTime.format("HH:mm");
  const stringStartDate = startDate.format("HH:mm");
  const stringEndDate = endDate.format("HH:mm");
  return (
    stringStartDate < stringSettingStartTime ||
    stringEndDate > stringSettingEndTime
  );
}

// Format to Indonesia Currency
export const formatToIndonesianCurrency = (currency: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(currency);
};

// Calculate income
export const calculateIncome = (rate: string, workDuration: number) => {
  const hourRate = parseFloat(rate);
  const hourWork = formatMillisecondsToHours(workDuration);

  return hourRate * hourWork;
};

// Calculate overtime income
export const calculateOvertimeIncome = (
  employeeRate: string,
  overtimeDuration: number,
  overtimeRate: string
) => {
  const hourRate = parseFloat(employeeRate);
  const rate = parseFloat(overtimeRate);
  const percentRate = rate / 100;
  const hourOvertime = formatMillisecondsToHours(overtimeDuration);
  const overtimeIncome = hourOvertime * hourRate * percentRate;

  return overtimeIncome;
};

export const calculateTotalIncome = (
  baseIncome: number,
  overtimeIncome: number
) => {
  return baseIncome + overtimeIncome;
};
