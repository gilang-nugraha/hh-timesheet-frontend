"use client";

import { SearchOffOutlined, SearchOutlined } from "@mui/icons-material";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMany } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { WorkType } from "@type/WorkType";
import Image from "next/image";
import React from "react";

export default function ActivityList() {
  const { dataGridProps, search } = useDataGrid({
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
          <TextField
            variant="outlined"
            placeholder="Cari"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      }
    >
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
