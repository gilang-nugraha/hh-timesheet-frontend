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
import {
  useApiUrl,
  useCustom,
  useList,
  useMany,
  useModal,
} from "@refinedev/core";
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
import { RoleType } from "@type/UserType";
import { WorkType } from "@type/WorkType";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

export default function ActivityList() {
  const APIURL = useApiUrl();
  const { data: roleData, isLoading: loadingRole } = useCustom({
    url: `${APIURL}/users-permissions/roles`,
    method: "get",
  });
  const employeeRole: RoleType = roleData?.data?.roles?.find(
    (role: RoleType) => role.name === "Authenticated"
  );

  const { dataGridProps, search, setFilters, filters } = useDataGrid({
    syncWithLocation: false,
    queryOptions: {
      enabled: !!employeeRole,
    },
    filters: {
      defaultBehavior: "replace",
      permanent: [
        {
          field: "role",
          operator: "eq",
          value: employeeRole?.id,
        },
      ],
    },
  });
  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "username",
        flex: 1,
        headerName: "Nama Karyawan",
        minWidth: 200,
      },
      {
        field: "rate",
        flex: 1,
        headerName: "Rate /jam",
        minWidth: 250,
        renderCell: function render({ row }) {
          return (
            <Typography variant="body2">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(row.rate)}
            </Typography>
          );
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

  const { loading } = dataGridProps;

  if (loadingRole || !employeeRole) {
    return <div>Loading...</div>;
  }

  return (
    <List
      title={
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight={"bold"}>
            Daftar Kegiatan
          </Typography>
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
              // onClick={() => {
              // }}
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
    </List>
  );
}
