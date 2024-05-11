import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm } from "@refinedev/react-hook-form";
import { ProjectType } from "@type/ProjectType";
import { WorkType, WorkTypeRequest } from "@type/WorkType";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import ProjectAutocomplete from "./ProjectAutocomplete";
import {
  useInvalidate,
  useModal,
  useNotification,
  useSelect,
} from "@refinedev/core";
import AddProjectCard from "./AddProjectCard";
import dayjs from "dayjs";
import {
  getUserRoleFromClientCookies,
  getUserfromClientCookies,
} from "@utility/user-utility";
import { UserType } from "@type/UserType";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 800,
};

interface Props {
  initialValue?: WorkType;
  initialUser?: UserType;
  onClose: () => void;
}
const AddWorkCard = ({ initialValue, initialUser, onClose }: Props) => {
  const { show, close, visible } = useModal();
  const { open: openNotification } = useNotification();

  const [selProject, setSelProject] = useState<ProjectType>();
  const [addProject, setAddProject] = useState<ProjectType>();
  const userRole = useMemo(() => getUserRoleFromClientCookies(), []);

  const user = useMemo(() => {
    return initialUser || getUserfromClientCookies();
  }, [initialUser]);

  console.log("initialUser", initialUser);

  // for admin testing purpose
  // const { options: userSelectProps } = useSelect({
  //   resource: "users",
  //   hasPagination: false,
  //   filters: [
  //     {
  //       field: "role",
  //       operator: "eq",
  //       value: userRole.id,
  //     },
  //   ],
  //   optionLabel: "username",
  //   optionValue: "id",
  // });
  // const userOptions = userSelectProps || [];

  const defaultValues: WorkType | WorkTypeRequest = initialValue || {
    name: "",
    employee: user?.id,
    project: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  };

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    refineCoreProps: {
      ...(initialValue && { id: initialValue.id }),
      action: initialValue ? "edit" : "create",
      resource: "timesheet",
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    ...(initialValue && { defaultValues: defaultValues as WorkType }),
  });

  const onFinishHandler = (data: WorkType) => {
    const startDate = dayjs(data.startDate).format("YYYY-MM-DD");
    const endDate = dayjs(data.endDate).format("YYYY-MM-DD");
    const startTime = dayjs(data.startTime).format("HH:mm");
    const endTime = dayjs(data.endTime).format("HH:mm");

    //validation for startDate must be equal or less than endDate
    if (startDate > endDate) {
      openNotification?.({
        type: "error",
        message: "Error",
        description: "Tanggal Mulai Harus Kurang dari Tanggal Selesai",
        key: "notification-key",
      });
      return;
    }

    //validation is same date but startTime must be less than endTime
    if (startDate === endDate && startTime >= endTime) {
      openNotification?.({
        type: "error",
        message: "Error",
        description: "Waktu Mulai Harus Kurang dari Waktu Selesai",
        key: "notification-key",
      });

      return;
    }

    //combine startDate with startTime
    const combineStartDate = dayjs(`${startDate} ${startTime}`).format(
      "YYYY-MM-DD HH:mm"
    );
    const combineEndDate = dayjs(`${endDate} ${endTime}`).format(
      "YYYY-MM-DD HH:mm"
    );

    // for admin testing purpose
    // if (userRole.name !== "Manager") {
    //   data.employee = user.id;
    // }

    const requestData = {
      ...data,
      startDate: combineStartDate,
      endDate: combineEndDate,
      employee: user.id,
    };
    onFinish(requestData);
  };
  return (
    <>
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
                  {initialValue ? "Ubah" : "Tambah"} Kegiatan
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction={"column"} gap={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Controller
                        name="startDate"
                        control={control}
                        defaultValue={initialValue?.startDate}
                        render={({ field }) => (
                          <DatePicker
                            label="Tanggal Mulai *"
                            format="DD MMMM YYYY"
                            onChange={(newValue) => {
                              field.onChange(newValue);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Controller
                        name="endDate"
                        control={control}
                        defaultValue={initialValue?.startDate}
                        render={({ field }) => (
                          <DatePicker
                            label="Tanggal Berakhir *"
                            format="DD MMMM YYYY"
                            minDate={dayjs(getValues("startDate"))}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Controller
                        name="startTime"
                        control={control}
                        defaultValue={initialValue?.startDate}
                        render={({ field }) => (
                          <TimePicker
                            label="Jam Mulai *"
                            format="HH:mm"
                            ampm={false}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <Controller
                        name="endTime"
                        control={control}
                        defaultValue={initialValue?.startDate}
                        render={({ field }) => (
                          <TimePicker
                            label="Jam Berakhir *"
                            format="HH:mm"
                            ampm={false}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                {/* comment it now only for testing/debug purpose */}
                {/* {userRole?.name === "Manager" && (
                  <FormControl fullWidth>
                    <InputLabel id="filter-select-label">
                      Pilih Karyawan *
                    </InputLabel>

                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      {...register("employee", {
                        required: "Wajib diisi",
                      })}
                      {...userSelectProps}
                      required
                      value={getValues("employee")}
                      fullWidth
                      variant="outlined"
                      label="Pilih Karyawan *"
                      error={!!(errors.employee && errors.employee.message)}
                    >
                      {userOptions?.map((option) => {
                        return (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            disabled={option.value === getValues("employee")}
                          >
                            {option.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )} */}
                <FormControl fullWidth>
                  <TextField
                    {...register("name", {
                      required: "Wajib diisi",
                    })}
                    error={!!(errors.name && errors.name.message)}
                    helperText={errors.name && errors.name.message}
                    label="Judul Kegiatan *"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <ProjectAutocomplete
                    {...register("project", {
                      required: "Wajib diisi",
                    })}
                    selectedProject={selProject}
                    onClick={(val) => {
                      const id = val?.id || "";
                      setSelProject(val);
                      setValue("project", id);
                    }}
                    onAdd={(value) => {
                      setAddProject({ name: value });
                      show();
                    }}
                  />
                </FormControl>
              </Stack>
            </LocalizationProvider>
          </CardContent>
          <CardActions
            sx={{ justifyContent: "space-between", padding: 2, gap: 2 }}
          >
            <Button variant="text" color="primary" onClick={onClose}>
              Batalkan
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              value="Submit"
              disabled={formLoading}
            >
              Simpan
            </Button>
          </CardActions>
        </form>
      </Card>
      <Modal
        open={visible}
        onClose={() => {
          close();
        }}
      >
        <AddProjectCard
          onClose={() => close()}
          initialValue={addProject as ProjectType}
        />
      </Modal>
    </>
  );
};

export default AddWorkCard;
