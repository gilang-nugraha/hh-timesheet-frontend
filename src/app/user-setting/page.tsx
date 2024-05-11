"use client";

import { PercentOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BaseRecord, CanAccess, useApiUrl, useCustom } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { SettingType } from "@type/SettingType";
import { UserRequestType, UserType } from "@type/UserType";
import { getUserfromClientCookies } from "@utility/user-utility";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useMemo } from "react";
dayjs.extend(utc);
dayjs.extend(timezone);

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 600,
};

export default function SettingPage() {
  const user = useMemo(() => getUserfromClientCookies(), []);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
    }
  }, [userId]);

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      action: "edit",
      redirect: false,
      resource: "users",
      id: userId,
    },
  });

  const onFinishHandler = (data: UserRequestType) => {
    if (!data.password) {
      const { password, ...requestData } = data;
      onFinish(requestData);
    } else {
      onFinish(data);
    }
  };

  if (userId) {
    return (
      <CanAccess
        resource="user-setting"
        action="list"
        fallback={<Typography>No access</Typography>}
      >
        <Card sx={style}>
          <form
            onSubmit={handleSubmit((data) =>
              onFinishHandler(data as UserRequestType)
            )}
          >
            <CardHeader
              title={
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h6" fontWeight={"bold"}>
                    Pengaturan
                  </Typography>
                </Stack>
              }
            />
            <CardContent
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <Stack direction={"column"} gap={2}>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    label="Nama"
                    placeholder="Username"
                    defaultValue={user?.username}
                    {...register("username")}
                    error={!!errors.username}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    label="Rate"
                    type="number"
                    placeholder="Rate"
                    defaultValue={user?.rate}
                    {...register("rate")}
                    error={!!errors.rate}
                    InputProps={{ endAdornment: <Typography>/Jam</Typography> }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    label="Password"
                    autoComplete="off"
                    placeholder="Password"
                    {...register("password")}
                    error={!!errors.password}
                    type="password"
                  />
                </FormControl>
              </Stack>
            </CardContent>
            <CardActions
              sx={{ justifyContent: "space-between", padding: 2, gap: 2 }}
            >
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                value="Submit"
                disabled={formLoading}
              >
                Simpan
              </Button>
            </CardActions>
          </form>
        </Card>
      </CanAccess>
    );
  }
}
