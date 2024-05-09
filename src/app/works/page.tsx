"use client";

import ModalFilter from "@components/reuseable/ModalFIlter";
import {
  Filter1Outlined,
  FilterList,
  FilterOutlined,
  SearchOffOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useList, useMany, useModal } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { ProjectType } from "@type/ProjectType";
import { WorkType } from "@type/WorkType";
import Image from "next/image";
import React from "react";

export default function ActivityList() {
  const { visible, show, close } = useModal();

  const { dataGridProps, search, setFilters } = useDataGrid({
    syncWithLocation: false,
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
        minWidth: 200,
      },
      {
        field: "project.name",
        flex: 1,
        headerName: "Nama Proyek",
        minWidth: 250,
        valueGetter: (params) => params.row.project.name,
      },
      {
        field: "employee.username",
        flex: 1,
        headerName: "Nama Karyawan",
        minWidth: 250,
        valueGetter: (params) => params.row.employee.username,
      },
      {
        field: "startDate",
        flex: 1,
        headerName: "Tanggal Mulai",
        minWidth: 250,
        renderCell: function render({ value }) {
          return <DateField value={value} format="DD MMMM YYYY" />;
        },
      },
      {
        field: "endDate",
        flex: 1,
        headerName: "Tanggal Berakhir",
        minWidth: 250,
        renderCell: function render({ value }) {
          return <DateField value={value} format="DD MMMM YYYY" />;
        },
      },
      {
        field: "timeStart",
        flex: 1,
        headerName: "Waktu Mulai",
        minWidth: 250,
        sortable: false,
        renderCell: function render({ value, row }) {
          return <DateField value={row.startDate} format="HH:mm" />;
        },
      },
      {
        field: "timeEnd",
        flex: 1,
        headerName: "Waktu Berakhir",
        minWidth: 250,
        sortable: false,
        renderCell: function render({ value, row }) {
          return <DateField value={row.endDate} format="HH:mm" />;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
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

  const { data: dataProject, isLoading } = useList<ProjectType>({
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

  return (
    <List
      title={
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Daftar Kegiatan</Typography>
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
      }
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        loading={loading}
      />
      <ModalFilter
        open={visible}
        onClose={close}
        filterData={projectList}
        multiple={true}
        inputTitle="Proyek"
        modalTitle="Filter"
        onFilter={handleFilterProject}
      />
    </List>
  );
}
