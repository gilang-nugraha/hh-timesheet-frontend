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
import { ProjectType } from "@type/ProjectType";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 600,
};

interface Props {
  initialValue?: ProjectType;
  onClose: () => void;
}
const AddProjectCard = ({ initialValue, onClose }: Props) => {
  const defaultValues: ProjectType = initialValue || {
    name: "",
  };

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      ...(initialValue && initialValue?.id && { id: initialValue.id }),
      action: initialValue && initialValue?.id ? "edit" : "create",
      resource: "projects",
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    defaultValues: defaultValues,
  });

  return (
    <Card sx={style}>
      <form onSubmit={handleSubmit(onFinish)}>
        <CardHeader
          title={
            <Stack
              direction={"row"}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={"bold"}>
                {initialValue && initialValue?.id ? "Ubah" : "Tambah"} Proyek
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
                label="Nama Proyek"
                {...register("name", {
                  required: "Nama Proyek harus diisi",
                })}
                error={!!errors.name}
              />
            </FormControl>
          </Stack>
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
  );
};

export default AddProjectCard;
