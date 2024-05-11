import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { formatDurationToIndonesiaTime } from "./calculate-timesheet";

interface PopsType {
  columns: GridColDef[];
  rows: GridRowsProp;
}

interface ExportRow {
  [header: string]: any;
}

export const exportToExcel = ({ columns, rows }: PopsType) => {
  console.log("columns", columns, "rows", rows);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  // Convert data with headers to sheet
  const dataWithHeaders: ExportRow[] = rows.map((row) => {
    const obj: ExportRow = {};
    //add id column
    obj["id"] = row.id;

    columns
      .filter((column) => column.headerName)
      .forEach((column) => {
        if (column.headerName) {
          // remove actions column
          if (
            column.field === "actions" ||
            column.field === "timeStart" ||
            column.field === "timeEnd"
          ) {
            return;
          }
          // format to date time if column.field is date
          if (column.field === "startDate" || column.field === "endDate") {
            obj[column.headerName] = dayjs(row[column.field]).format(
              "DD MMMM YYYY HH:mm"
            );
            return;
          }
          // format to indo time if column.field is time
          if (
            column.field === "overtimeDuration" ||
            column.field === "totalDuration"
          ) {
            obj[column.headerName] = formatDurationToIndonesiaTime(
              row[column.field]
            );
            return;
          }
          //if column.field is nested
          if (column.field.includes(".")) {
            obj[column.headerName] =
              row[column.field.split(".")[0]][column.field.split(".")[1]];
          } else {
            obj[column.headerName] = row[column.field];
          }
        }
      });
    return obj;
  });
  // Convert data with headers to sheet
  const ws = XLSX.utils.json_to_sheet(dataWithHeaders);

  // Create workbook and add sheet with data
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

  // Write workbook to buffer in xlsx format
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  // Convert buffer to Blob with specified MIME type
  const data = new Blob([excelBuffer], { type: fileType });

  // Save data as a file with specified filename
  FileSaver.saveAs(data, "Daftar Kegiatan" + fileExtension);
};
