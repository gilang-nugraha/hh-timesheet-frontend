"use client";

import AddEmployeeCard from "@components/reuseable/AddEmployeeCard";
import { AddCircleOutline, SearchOutlined } from "@mui/icons-material";
import {
  Button,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CanAccess, useApiUrl, useCustom, useModal } from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { RoleType, UserType } from "@type/UserType";
import { WorkType } from "@type/WorkType";
import React, { useMemo, useState } from "react";

export default function EmployeePage() {
  const { visible, show, close } = useModal();
  const [selEmployee, setSelEmployee] = useState<UserType>();

  const APIURL = useApiUrl();
  const { data: roleData } = useCustom({
    url: `${APIURL}/users-permissions/roles`,
    method: "get",
  });
  const employeeRole: RoleType = roleData?.data?.roles?.find(
    (role: RoleType) => role.name === "Authenticated"
  );

  const { dataGridProps, search, setFilters } = useDataGrid({
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
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "username",
        flex: 1,
        headerName: "Nama Karyawan",
        minWidth: 200,
      },

      {
        field: "email",
        flex: 1,
        headerName: "Email Karyawan",
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
              <EditButton
                hideText
                onClick={() => {
                  setSelEmployee(row);
                  show();
                }}
              />
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
  const { loading } = dataGridProps;

  return (
    <CanAccess
      resource="users"
      action="list"
      fallback={<Typography>No access</Typography>}
    >
      <List
        title={
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" fontWeight={"bold"}>
                Daftar Karyawan
              </Typography>

              <Button
                color="secondary"
                variant="outlined"
                startIcon={<AddCircleOutline />}
                onClick={show}
              >
                Tambah Karyawan
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
        <Modal
          open={visible}
          onClose={() => {
            close();
            setSelEmployee(undefined);
          }}
        >
          <AddEmployeeCard
            initialValue={selEmployee}
            onClose={() => {
              close();
              setSelEmployee(undefined);
            }}
          />
        </Modal>
      </List>
    </CanAccess>
  );
}
