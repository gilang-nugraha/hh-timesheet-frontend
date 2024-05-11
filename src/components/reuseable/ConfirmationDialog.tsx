import { Close } from "@mui/icons-material";
import {
  Button,
  Card,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}
export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={"bold"} color="primary">
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              p: 0,
            }}
          >
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="body1" color="default" mt={2} mb={4}>
          {description}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Button variant="text" color="error" onClick={onClose}>
            Batal
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Iya
          </Button>
        </Stack>
      </Card>
    </Modal>
  );
};

export default ConfirmationDialog;
