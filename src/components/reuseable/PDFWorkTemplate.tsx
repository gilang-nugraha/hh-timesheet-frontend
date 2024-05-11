"use client";

import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { UserType } from "@type/UserType";
import { SummaryTimesheetType, WorkType } from "@type/WorkType";
import {
  formatDurationToIndonesiaTime,
  formatToIndonesianCurrency,
} from "@utility/calculate-timesheet";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Image from "next/image";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  rows: GridRowsProp;
  columns: GridColDef[];
  user: UserType;
  summary: SummaryTimesheetType;
}

export const PDFWorkTemplate = ({ rows, columns, user, summary }: Props) => {
  return (
    <Box className="page" p={4}>
      <Stack direction={"row"} gap={4} my={4}>
        <Image src="/logo.png" alt="logo" width={120} height={50} />
        <Stack direction={"column"}>
          <Typography variant="body2">Nama Karyawan</Typography>
          <Typography>{user?.username || ""}</Typography>
        </Stack>
        <Stack direction={"column"}>
          <Typography variant="body2">Rate</Typography>
          <Typography>
            {formatToIndonesianCurrency(user?.rate || 0)}/jam
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      {rows && (
        <Table sx={{ my: 4 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                if (
                  column.field === "actions" ||
                  column.field === "timeStart" ||
                  column.field === "timeEnd"
                ) {
                  return;
                }
                return (
                  <TableCell key={column.field}>
                    <Typography variant="body1" fontWeight={"bold"}>
                      {column.headerName}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => {
                  if (
                    column.field === "actions" ||
                    column.field === "timeStart" ||
                    column.field === "timeEnd"
                  ) {
                    return;
                  }
                  if (
                    column.field === "startDate" ||
                    column.field === "endDate"
                  ) {
                    return (
                      <TableCell key={column.field}>
                        <Typography variant="body1">
                          {dayjs(row[column.field as keyof WorkType]).format(
                            "DD MMMM YYYY HH:mm"
                          )}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (
                    column.field === "overtimeDuration" ||
                    column.field === "totalDuration"
                  ) {
                    return (
                      <TableCell key={column.field}>
                        <Typography variant="body1">
                          {formatDurationToIndonesiaTime(
                            row[column.field as keyof WorkType]
                          )}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (
                    column.field === "totalIncome" ||
                    column.field === "overtimeIncome" ||
                    column.field === "baseIncome"
                  ) {
                    return (
                      <TableCell key={column.field}>
                        <Typography variant="body1">
                          {formatToIndonesianCurrency(
                            row[column.field as keyof WorkType]
                          )}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (column.field.includes(".")) {
                    return (
                      <TableCell key={column.field}>
                        <Typography variant="body1">
                          {
                            row[column.field.split(".")[0]][
                              column.field.split(".")[1]
                            ]
                          }
                        </Typography>
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={column.field}>
                        <Typography variant="body1">
                          {row[column.field as keyof WorkType]}
                        </Typography>
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Stack direction="column">
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1" color="secondary">
            Total Durasi Normal
          </Typography>
          <Typography variant="body1" color="secondary">
            {formatDurationToIndonesiaTime(summary.baseDuration)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1" color="primary">
            Total Durasi Lembur
          </Typography>
          <Typography variant="body1" color="primary">
            {formatDurationToIndonesiaTime(summary.overtimeDuration)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1" color="secondary">
            Total Pendapatan Normal
          </Typography>
          <Typography variant="body1" color="secondary">
            {formatToIndonesianCurrency(summary.baseIncome)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1" color="primary">
            Total Pendapatan Lembur
          </Typography>
          <Typography variant="body1" color="primary">
            {formatToIndonesianCurrency(summary.overtimeIncome)}
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight={"bold"} color="secondary">
            Total Durasi
          </Typography>
          <Typography variant="h6" fontWeight={"bold"} color="secondary">
            {formatDurationToIndonesiaTime(summary.totalDuration)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" fontWeight={"bold"} color="secondary">
            Total Pendapatan
          </Typography>
          <Typography variant="h5" fontWeight={"bold"} color="secondary">
            {formatToIndonesianCurrency(summary.totalIncome)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PDFWorkTemplate;
