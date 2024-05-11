"use client";

import AddWorkCard from "@components/reuseable/AddWorkCard";
import ModalFilter from "@components/reuseable/ModalFIlter";
import {
  AddCircleOutline,
  FilterList,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useList, useModal } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { ProjectType } from "@type/ProjectType";
import { WorkType } from "@type/WorkType";
import {
  formatMillisecondsToHHMM,
  formatToIndonesianCurrency,
  formatToIndonesianTime,
} from "@utility/calculate-timesheet";
import { getUserfromClientCookies } from "@utility/user-utility";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useMemo, useState } from "react";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimesheetPage() {
  const { visible, show, close } = useModal();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const {
    visible: visibleAddModal,
    show: showAddModal,
    close: closeAddModal,
  } = useModal();

  const user = useMemo(() => getUserfromClientCookies(), []);
  const userId = user?.id;
  useEffect(() => {
    if (userId) {
    }
  }, [userId]);
  const { dataGridProps, search, setFilters } = useDataGrid({
    resource: "works",
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
        sortable: false,
        valueGetter: (params) => {
          const overTimeDuration = formatMillisecondsToHHMM(
            params.row.overtimeDuration
          );
          return `${formatToIndonesianTime(overTimeDuration)}`;
        },
      },

      {
        field: "totalDuration",
        flex: 1,
        headerName: "Total Durasi",
        sortable: false,
        valueGetter: (params) => {
          const totalDuration = formatMillisecondsToHHMM(
            params.row.totalDuration
          );
          return `${formatToIndonesianTime(totalDuration)}`;
        },
      },
      {
        field: "baseIncome",
        flex: 1,
        headerName: "Pendapatan Normal",
        sortable: false,
        valueGetter: (params) => {
          return `${formatToIndonesianCurrency(params.row.baseIncome)}`;
        },
      },

      {
        field: "overtimeIncome",
        flex: 1,
        headerName: "Pendapatan Lembur",
        sortable: false,
        valueGetter: (params) => {
          return `${formatToIndonesianCurrency(params.row.overtimeIncome)}`;
        },
      },
      {
        field: "totalIncome",
        flex: 1,
        headerName: "Total Pendapatan",
        sortable: false,
        valueGetter: (params) => {
          return `${formatToIndonesianCurrency(params.row.totalIncome)}`;
        },
      },
      {
        field: "actions",
        headerName: "Aksi",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
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
  if (!isLoading) {
    return (
      <>
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
                  {formatToIndonesianCurrency(user.rate || 0)}/jam
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" fontWeight={"bold"}>
                Daftar Kegiatan
              </Typography>

              <Button
                color="secondary"
                variant="outlined"
                startIcon={<AddCircleOutline />}
                onClick={showAddModal}
              >
                Tambah Kegiatan
              </Button>
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
          />
          <Stack direction="column" gap={2}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" color="secondary">
                Total Durasi
              </Typography>
              <Typography variant="h6" fontWeight={"bold"} color="secondary">
                -
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
                {formatToIndonesianCurrency(0)}
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
          <AddWorkCard onClose={closeAddModal} />
        </Modal>
      </>
    );
  }
}
