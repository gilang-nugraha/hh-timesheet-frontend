"use client";

import dynamic from "next/dynamic";

import AddWorkCard from "@components/reuseable/AddWorkCard";
import ConfirmationDialog from "@components/reuseable/ConfirmationDialog";
import EditWorkCard from "@components/reuseable/EditWorkCard";
import ModalFilter from "@components/reuseable/ModalFIlter";
import PDFWorkTemplate from "@components/reuseable/PDFWorkTemplate";
import {
  AddCircleOutline,
  EditOutlined,
  FilterList,
  ImportExportOutlined,
  PriorityHighOutlined,
  QuestionMarkOutlined,
  SearchOutlined,
  UpdateOutlined,
} from "@mui/icons-material";
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Popper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CalendarIcon } from "@mui/x-date-pickers";
import {
  BaseKey,
  CanAccess,
  useExport,
  useList,
  useModal,
  useOne,
  useUpdateMany,
} from "@refinedev/core";
import { DateField, DeleteButton, List, useDataGrid } from "@refinedev/mui";
import { ProjectType } from "@type/ProjectType";
import { UserType } from "@type/UserType";
import { SummaryTimesheetType, WorkType } from "@type/WorkType";
import {
  formatDurationToIndonesiaTime,
  formatToIndonesianCurrency,
} from "@utility/calculate-timesheet";
import { exportToExcel } from "@utility/export-table";
import { getUserfromClientCookies } from "@utility/user-utility";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import _ from "lodash";
import type { DateRange } from "mui-daterange-picker-plus";
import { PickerModal } from "mui-daterange-picker-plus";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useState } from "react";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const handlePdf = async () => {
  const htmlElement = document.getElementsByClassName("page");
  if (!htmlElement) {
    console.error("HTML element not found");
    return;
  }

  const html2PDF = (await import("jspdf-html2canvas")).default;

  await html2PDF(htmlElement as any, {
    jsPDF: {
      format: "a4",
      orientation: "landscape",
    },
    html2canvas: {
      scale: 5,
    },
    init: function (data) {
      // console.log("data", data);
    },
    watermark({ pdf, pageNumber, totalPageNumber }) {
      // pdf: jsPDF instance
      pdf.setTextColor("#ddd");
      pdf.text(
        `page: ${pageNumber}/${totalPageNumber}`,
        50,
        pdf.internal.pageSize.height - 30
      );
    },
    imageType: "image/jpeg",
    output: "Timesheet.pdf",
  });
};

const DynamicPdfComponent = dynamic(() => Promise.resolve(handlePdf) as any, {
  ssr: false,
});

export default function EmployeeTimesheetPage() {
  const { mutate: recalculate } = useUpdateMany();
  const {
    visible: loadingModal,
    show: showLoadingModal,
    close: closeLoadingModal,
  } = useModal();
  const { visible, show, close } = useModal();
  const {
    visible: confirmationModal,
    show: showConfirmationModal,
    close: closeConfirmationModal,
  } = useModal();
  const {
    visible: visibleCalendar,
    show: showCalendar,
    close: closeCalendar,
  } = useModal();

  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenPopper((previousOpen) => !previousOpen);
  };

  const canBeOpen = openPopper && Boolean(anchorEl);
  const idPopper = canBeOpen ? "exportimport-popper" : undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<BaseKey[]>();

  const [dateRange, setDateRange] = useState<DateRange>({});

  const [initialValue, setInitialValue] = useState<WorkType>();
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const {
    visible: visibleAddModal,
    show: showAddModal,
    close: closeAddModal,
  } = useModal();

  const {
    visible: visibleEditModal,
    show: showEditModal,
    close: closeEditModal,
  } = useModal();

  //get query params
  const { id: paramId } = useParams();
  const userCookie = useMemo(() => getUserfromClientCookies(), []);

  const userId = useMemo(() => {
    if (!paramId) {
      return userCookie?.id;
    } else {
      return paramId;
    }
  }, [userCookie, paramId]);

  const { data: userData, isLoading: isLoadingUser } = useOne({
    resource: "users",
    id: userId as BaseKey,
    queryOptions: { enabled: !!userId },
  });
  const { triggerExport: exportCsv } = useExport({
    resource: "timesheet",
    filters: [
      {
        field: "employee",
        operator: "eq",
        value: userId,
      },
    ],
  });

  const user = userData?.data as UserType;

  const { dataGridProps, search, setFilters } = useDataGrid({
    resource: "timesheet",
    syncWithLocation: false,
    filters: {
      defaultBehavior: "replace",
      permanent: [
        {
          field: "employee",
          operator: "eq",
          value: userId,
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "startDate",
          order: "desc",
        },
      ],
    },
    meta: {
      populate: "*",
    },
    onSearch: (values: WorkType) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
  });

  const { loading } = dataGridProps;

  const logsheets = dataGridProps?.rows;

  const summary: SummaryTimesheetType = useMemo(() => {
    return {
      baseDuration: _.sumBy(logsheets, "baseDuration"),
      overtimeDuration: _.sumBy(logsheets, "overtimeDuration"),
      overtimeIncome: _.sumBy(logsheets, "overtimeIncome"),
      baseIncome: _.sumBy(logsheets, "baseIncome"),
      totalIncome: _.sumBy(logsheets, "totalIncome"),
      totalDuration: _.sumBy(logsheets, "totalDuration"),
    };
  }, [logsheets]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        flex: 1,
        headerName: "Judul Kegiatan",
      },
      {
        field: "project.name",
        flex: 1,
        headerName: "Nama Proyek",
        valueGetter: (params) => params.row.project.name,
      },
      {
        field: "startDate",
        flex: 1,
        headerName: "Tanggal Mulai",
        renderCell: function render({ value }) {
          return <DateField value={value} format="DD MMMM YYYY" />;
        },
      },
      {
        field: "endDate",
        flex: 1,
        headerName: "Tanggal Berakhir",
        renderCell: function render({ value }) {
          return <DateField value={value} format="DD MMMM YYYY" />;
        },
      },
      {
        field: "timeStart",
        flex: 1,
        headerName: "Waktu Mulai",
        sortable: false,
        renderCell: function render({ value, row }) {
          return <DateField value={row.startDate} format="HH:mm" />;
        },
      },
      {
        field: "timeEnd",
        flex: 1,
        headerName: "Waktu Berakhir",
        sortable: false,
        renderCell: function render({ value, row }) {
          return <DateField value={row.endDate} format="HH:mm" />;
        },
      },
      {
        field: "overtimeDuration",
        flex: 1,
        headerName: "Durasi Lembur",
        valueGetter: (params) => {
          return `${formatDurationToIndonesiaTime(
            params.row.overtimeDuration
          )}`;
        },
      },

      {
        field: "totalDuration",
        flex: 1,
        headerName: "Total Durasi",
        valueGetter: (params) => {
          return `${formatDurationToIndonesiaTime(params.row.totalDuration)}`;
        },
      },
      {
        field: "baseIncome",
        flex: 1,
        headerName: "Pendapatan Normal",
        valueGetter: (params) => {
          return `${formatToIndonesianCurrency(params.row.baseIncome)}`;
        },
      },

      {
        field: "overtimeIncome",
        flex: 1,
        headerName: "Pendapatan Lembur",
        valueGetter: (params) => {
          return `${formatToIndonesianCurrency(params.row.overtimeIncome)}`;
        },
      },
      {
        field: "totalIncome",
        flex: 1,
        headerName: "Total Pendapatan",
        valueGetter: (params) => {
          return `${formatToIndonesianCurrency(params.row.totalIncome)}`;
        },
      },

      {
        field: "employeeRate",
        flex: 1,
        headerName: "Rate /Jam",
        valueGetter: (params) => {
          return `${formatToIndonesianCurrency(params.row.employeeRate)}`;
        },
      },

      {
        field: "setting.overtimeRate",
        flex: 1,
        headerName: "% Rate",
        renderCell: (params) => {
          return params.row.setting?.overtimeRate;
        },
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Aksi",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <Button
                onClick={() => {
                  setInitialValue({
                    ...row,
                    employee: row?.employee?.id,
                    project: row?.project,
                  });
                  showEditModal();
                }}
                sx={{ minWidth: 0 }}
              >
                <EditOutlined fontSize="small" sx={{ selfAlign: "center" }} />
              </Button>
              <DeleteButton
                hideText
                recordItemId={row.id}
                resource="works"
                invalidates={["list"]}
                disabled={false}
              />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    []
  );

  const { data: dataProject } = useList<ProjectType>({
    resource: "projects",
  });

  const projectList = dataProject?.data || [];

  const handleSearch = (value: string) => {
    if (value.length >= 3 || value === "") {
      search({ name: value } as WorkType);
    }
  };

  const handleFilterProject = (value: string | string[]) => {
    setFilters([
      {
        field: "project",
        value: value ? value : undefined,
        operator: "eq",
      },
    ]);
  };

  const handleRecalculate = () => {
    recalculate(
      {
        resource: "timesheet",
        values: {
          employee: user?.id,
        },
        ids: selectedRows || [],
        invalidates: ["list"],
      },
      {
        onSuccess: () => {
          closeConfirmationModal();
        },
        onError: () => {
          closeConfirmationModal();
        },
      }
    );
  };

  const handleExport = async (type: string) => {
    showLoadingModal();
    const rows = dataGridProps?.rows || [];
    if (type === "excel") {
      await exportToExcel({ columns, rows });
    } else if (type === "csv") {
      await exportCsv();
    } else if (type === "pdf") {
      await handlePdf();
    }
    closeLoadingModal();
  };

  if (!isLoading) {
    return (
      <CanAccess
        resource="users"
        action="list"
        fallback={<Typography>No access</Typography>}
      >
        <List
          title={
            <Stack direction={"row"} gap={4}>
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
          }
          headerProps={{
            sx: {
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              my: 4,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={"bold"}>
                Daftar Kegiatan
              </Typography>
              <Tooltip
                title={
                  <Stack direction={"column"}>
                    <Typography variant="caption">
                      - perhitungan lembur adalah <br />
                      (total durasi lembur * rate) * %rate lembur yang berlaku
                      saat submit
                    </Typography>
                    <Typography variant="caption">
                      - %rate lembur yang berlaku saat submit
                    </Typography>
                  </Stack>
                }
                arrow
                disableInteractive
              >
                <QuestionMarkOutlined fontSize="small" color={"secondary"} />
              </Tooltip>
              <Tooltip
                title={
                  <Stack direction={"column"}>
                    <Typography variant="caption">
                      - perhitungan pendapatan dihandle dari backend ketika
                      submit kegiatan
                    </Typography>
                    <Typography variant="caption">
                      - untuk flow saat ini data rate diambil dari rate yang
                      berlaku saat submit
                    </Typography>
                    <Typography variant="caption">
                      - jika ingin update perhitungan dari data yang sudah ada,
                      harus ada trigger untuk recalculate ke rate dan %rate saat
                      ini
                    </Typography>
                  </Stack>
                }
                arrow
                disableInteractive
              >
                <PriorityHighOutlined fontSize="small" color={"primary"} />
              </Tooltip>
              <Button
                color="secondary"
                variant="outlined"
                startIcon={<AddCircleOutline />}
                onClick={showAddModal}
              >
                Tambah Kegiatan
              </Button>
              {selectedRows && selectedRows?.length > 0 && (
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<UpdateOutlined />}
                  onClick={showConfirmationModal}
                >
                  Kalkulasi Ulang
                </Button>
              )}
            </Stack>

            <Stack direction="row" gap={1} alignItems="center">
              <TextField
                variant="outlined"
                placeholder="Cari"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton color="primary" onClick={showCalendar}>
                <CalendarIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => {
                  show();
                }}
              >
                <FilterList />
              </IconButton>
              <Fragment>
                <IconButton
                  color="primary"
                  aria-describedby={idPopper}
                  onClick={handleClickPopper}
                >
                  <ImportExportOutlined />
                </IconButton>
                <Popper
                  id={idPopper}
                  open={openPopper}
                  anchorEl={anchorEl}
                  placement="bottom-end"
                  sx={{
                    zIndex: 1,
                  }}
                >
                  <Paper>
                    <MenuItem onClick={() => handleExport("excel")}>
                      Export to Excel
                    </MenuItem>
                    <MenuItem onClick={() => handleExport("csv")}>
                      Export to CSV
                    </MenuItem>
                    <MenuItem onClick={() => handleExport("pdf")}>
                      Print to PDF
                    </MenuItem>
                    {/* todo */}
                    {/* <MenuItem>Import from CSV</MenuItem> */}
                  </Paper>
                </Popper>
              </Fragment>
            </Stack>
          </Stack>
          <DataGrid
            {...dataGridProps}
            columns={columns}
            autoHeight
            loading={loading}
            checkboxSelection
            onRowSelectionModelChange={(ids) => {
              setSelectedRows(ids);
            }}
          />
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
        </List>

        <ModalFilter
          open={visible}
          onClose={close}
          filterData={projectList as { id: string | number; name: string }[]}
          multiple={true}
          inputTitle="Proyek"
          modalTitle="Filter"
          onFilter={handleFilterProject}
        />
        <Modal open={visibleAddModal} onClose={closeAddModal}>
          <AddWorkCard onClose={closeAddModal} initialUser={user} />
        </Modal>
        <Modal open={visibleEditModal} onClose={closeEditModal}>
          <EditWorkCard
            onClose={closeEditModal}
            initialValue={initialValue as WorkType}
            initialUser={user}
          />
        </Modal>

        <ConfirmationDialog
          open={confirmationModal}
          onClose={closeConfirmationModal}
          onConfirm={handleRecalculate}
          title="Kalkulasi Ulang Kegiatan"
          description="Apakah anda yakin ingin kalkulasi ulang kegiatan ?"
        />
        <PickerModal
          onChange={(range: DateRange) => setDateRange(range)}
          modalProps={{
            open: visibleCalendar,
            onClose: closeCalendar,
            slotProps: {
              root: {
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  opacity: 1,
                  transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                },
              },
              paper: {
                sx: {
                  position: "absolute",
                  top: "50% !important",
                  left: "50% !important",
                  transform: "translate(-50%, -50%) !important",
                },
              },
            },
          }}
          initialDateRange={{
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }}
          customProps={{
            onSubmit: (value: DateRange) => {
              setDateRange(value);
              setFilters([
                {
                  field: "startDate",
                  value: dayjs(value.startDate).toISOString(),
                  operator: "gte",
                },
                {
                  field: "endDate",
                  value: dayjs(value.endDate).toISOString(),
                  operator: "lte",
                },
              ]);
              closeCalendar();
            },
            onCloseCallback() {
              setDateRange({});
              setFilters([]);
              closeCalendar();
            },
          }}
        />
        {loadingModal && (
          <PDFWorkTemplate
            rows={dataGridProps?.rows}
            columns={columns}
            user={user}
            summary={summary}
          />
        )}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingModal}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      </CanAccess>
    );
  }
}
