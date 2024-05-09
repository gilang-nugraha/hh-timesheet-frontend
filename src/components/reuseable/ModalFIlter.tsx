import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props<T extends { id: string | number }> {
  open: boolean;
  modalTitle: string;
  inputTitle: string;
  multiple: boolean;
  onClose: () => void;
  filterData: T[];
  onFilter: (value: string | string[]) => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 600,
};

const ModalFilter = <T extends { id: string | number; name: string }>({
  open,
  modalTitle,
  inputTitle,
  onClose,
  multiple,
  filterData,
  onFilter,
}: Props<T>) => {
  const [selected, setSelected] = useState<string[] | string>(
    multiple ? [] : ""
  );

  const handleChipDelete = (removeValue: string) => {
    setSelected((prevSelected) => {
      const selectedArray = Array.isArray(prevSelected)
        ? prevSelected
        : [prevSelected];
      return selectedArray.filter((value) => value !== removeValue);
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Card sx={style}>
        <CardHeader
          title={
            <Stack
              direction={"row"}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={"bold"}>
                {modalTitle}
              </Typography>
              <IconButton onClick={onClose}>
                <CloseOutlined />
              </IconButton>
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
          <FormControl required fullWidth>
            <InputLabel id="filter-select-label">{inputTitle}</InputLabel>
            <Select
              variant="outlined"
              labelId="filter-select-label"
              id="filter-select"
              required
              label={`${inputTitle} *`}
              multiple={multiple}
              fullWidth
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              renderValue={(selected) => {
                if (multiple) {
                  const selectedArray = Array.isArray(selected)
                    ? selected
                    : [selected];
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selectedArray.map((value) => {
                        const selectedItem = filterData.find(
                          (item) => item.id === value
                        );
                        return (
                          <Chip
                            key={value}
                            onDelete={() => handleChipDelete(value)}
                            label={selectedItem ? selectedItem.name : ""}
                            onMouseDown={(event) => {
                              event.stopPropagation();
                            }}
                          />
                        );
                      })}
                    </Box>
                  );
                } else {
                  return filterData.find((item) => item.id === selected)?.name;
                }
              }}
            >
              {filterData?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", padding: 2, gap: 2 }}>
          <Button
            variant="text"
            onClick={() => {
              setSelected(multiple ? [] : "");
              onFilter("");
            }}
          >
            Hapus Filter
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onFilter(selected);
              onClose();
            }}
          >
            Terapkan
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default ModalFilter;
