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
import { useModal } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { UserType } from "@type/UserType";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 600,
};

interface Props {
  initialValue?: UserType;
  onClose: () => void;
}
const AddEmployeeCard = ({ initialValue, onClose }: Props) => {
  const defaultValues: UserType = initialValue || {
    username: "",
    email: "",
    password: "",
    role: 1,
    rate: 0,
    confirmed: true,
  };

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      ...(initialValue && { id: initialValue.id }),
      action: initialValue ? "edit" : "create",
      resource: "users",
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    defaultValues: defaultValues,
  });

  const onFinishHandler = (data: UserType) => {
    if (initialValue && !data.password) {
      const { password, ...requestData } = data;
      onFinish(requestData);
    } else {
      onFinish(data);
    }
  };

  return (
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
                {initialValue ? "Ubah" : "Tambah"} Karyawan
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
                label="Nama Karyawan"
                {...register("username", {
                  required: "Nama harus diisi",
                })}
                error={!!errors.username}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email harus diisi",
                })}
                error={!!errors.email}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                label="Password"
                type="password"
                {...register("password", {
                  required: initialValue ? false : "Password harus diisi",
                })}
                error={!!errors.password}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                label="Rate"
                type="number"
                {...register("rate", {
                  required: "Rate harus diisi",
                })}
                error={!!errors.rate}
              />
            </FormControl>
          </Stack>
        </CardContent>
        <CardActions
          sx={{ justifyContent: "space-between", padding: 2, gap: 2 }}
        >
          <Button variant="text" color="secondary" onClick={onClose}>
            Batalkan
          </Button>
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
  );
};

export default AddEmployeeCard;
