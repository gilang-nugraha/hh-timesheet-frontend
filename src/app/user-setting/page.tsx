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
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";
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
  const APIURL = useApiUrl();
  const { data, isLoading } = useCustom<BaseRecord>({
    url: `${APIURL}/work-time`,
    method: "get",
    queryOptions: {
      enabled: true,
    },
  });

  const settingData: SettingType = useMemo(() => {
    return data?.data?.data;
  }, [data]);
  const {
    refineCore: { onFinish, formLoading },
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      action: "edit",
      redirect: false,
    },
    defaultValues: settingData,
  });

  const onFinishHandler = (data: SettingType) => {
    data.startTime =
      settingData?.startTime !== data.startTime
        ? data.startTime + ":00.000"
        : settingData?.startTime;
    data.endTime =
      settingData?.endTime !== data.endTime
        ? data.endTime + ":00.000"
        : settingData?.endTime;
    onFinish(data);
  };

  if (settingData) {
    return (
      <CanAccess
        resource="user-setting"
        action="list"
        fallback={<Typography>No access</Typography>}
      >
        <Card sx={style}>
          <form onSubmit={handleSubmit(onFinishHandler)}>
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
                    label="Jam Mulai Bekerja"
                    type="time"
                    {...register("startTime")}
                    defaultValue={settingData?.startTime}
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    label="Jam Selesai Bekerja"
                    type="time"
                    {...register("endTime")}
                    defaultValue={settingData?.endTime}
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    label="Persen Rate"
                    type="number"
                    {...register("overtimeRate")}
                    defaultValue={settingData?.overtimeRate}
                    error={!!errors.overtimeRate}
                    helperText={errors.overtimeRate?.message}
                    InputProps={{ endAdornment: <PercentOutlined /> }}
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
