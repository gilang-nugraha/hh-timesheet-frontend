"use client";

import AddWorkCard from "@components/reuseable/AddWorkCard";
import ConfirmationDialog from "@components/reuseable/ConfirmationDialog";
import EditWorkCard from "@components/reuseable/EditWorkCard";
import ModalFilter from "@components/reuseable/ModalFIlter";
import {
  AddCircleOutline,
  EditOutlined,
  FilterList,
  PriorityHighOutlined,
  QuestionMarkOutlined,
  SearchOutlined,
  UpdateOutlined,
  WarningOutlined,
} from "@mui/icons-material";
import {
  Button,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  BaseKey,
  CanAccess,
  useList,
  useModal,
  useOne,
  useUpdateMany,
} from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  useDataGrid,
} from "@refinedev/mui";
import { ProjectType } from "@type/ProjectType";
import { UserType } from "@type/UserType";
import { WorkType } from "@type/WorkType";
import {
  formatDurationToIndonesiaTime,
  formatToIndonesianCurrency,
} from "@utility/calculate-timesheet";
import { getUserfromClientCookies } from "@utility/user-utility";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import _ from "lodash";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { PickerBase, PickerModal } from "mui-daterange-picker-plus";
import type { DateRange } from "mui-daterange-picker-plus";
import { CalendarIcon } from "@mui/x-date-pickers";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimesheetPage() {
  const { mutate: recalculate } = useUpdateMany();

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

  const summaryBaseDuration = useMemo(() => {
    return _.sumBy(logsheets, "baseDuration");
  }, [logsheets]);

  const summaryOvertimeDuration = useMemo(() => {
    return _.sumBy(logsheets, "overtimeDuration");
  }, [logsheets]);

  const summaryOvertimeIncome = useMemo(() => {
    return _.sumBy(logsheets, "overtimeIncome");
  }, [logsheets]);

  const summaryBaseIncome = useMemo(() => {
    return _.sumBy(logsheets, "baseIncome");
  }, [logsheets]);
  const summaryTotalIncome = useMemo(() => {
    return _.sumBy(logsheets, "totalIncome");
  }, [logsheets]);

  const summaryTotalDuration = useMemo(() => {
    return _.sumBy(logsheets, "totalDuration");
  }, [logsheets]);

  const columns = React.useMemo<GridColDef[]>(
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
        valueGetter: (params) => {
          return `${params.row.setting.overtimeRate}%`;
        },
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

            <Stack direction="row" spacing={2} alignItems="center">
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
                {formatDurationToIndonesiaTime(summaryBaseDuration)}
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
                {formatDurationToIndonesiaTime(summaryOvertimeDuration)}
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
                {formatToIndonesianCurrency(summaryBaseIncome)}
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
                {formatToIndonesianCurrency(summaryOvertimeIncome)}
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
                {formatDurationToIndonesiaTime(summaryTotalDuration)}
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
                {formatToIndonesianCurrency(summaryTotalIncome)}
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
      </CanAccess>
    );
  }
}
