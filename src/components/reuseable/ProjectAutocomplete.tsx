import {
  Autocomplete,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { useState } from "react";
import _ from "lodash";
import { ProjectType } from "@type/ProjectType";
import { useAutocomplete } from "@refinedev/mui";
import { AddOutlined } from "@mui/icons-material";

interface ProjectAutocomplete {
  selectedProject?: ProjectType;
  onClick: (value: ProjectType) => void;
  onAdd: (value: string) => void;
}
const filter = createFilterOptions<ProjectType>();

export default function ProjectAutocomplete({
  selectedProject,
  onClick,
  onAdd,
}: ProjectAutocomplete) {
  const { autocompleteProps } = useAutocomplete<ProjectType>({
    resource: "projects",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });
  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField {...params} label={"Nama Proyek *"} />
      )}
      selectOnFocus
      clearOnBlur
      filterSelectedOptions
      handleHomeEndKeys
      {...autocompleteProps}
      value={selectedProject}
      onChange={(event, newValue, reason, details) => {
        if (details?.option.id === "new") {
          onAdd(details?.option?.name || "");
        } else {
          onClick(newValue as ProjectType);
        }
      }}
      loading={autocompleteProps.loading}
      renderOption={(props, option) => {
        let label = option?.name || "";
        if (option.id === "new") {
          label = `Tambah Proyek "${option.name}"`;
        }

        return (
          <li {...props} key={option.id}>
            {option.id === "new" && <AddOutlined color="primary" />}
            <Typography color={option.id === "new" ? "primary" : "default"}>
              {label}
            </Typography>
          </li>
        );
      }}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option?.name || "";
      }}
      filterOptions={(options, params) => {
        const { inputValue } = params;
        const filtered = filter(options, params);
        const isExisting = options.some(
          (option) => inputValue.toLowerCase() === option.name?.toLowerCase()
        );

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            id: "new",
            name: inputValue,
          });
        }

        return filtered;
      }}
    />
  );
}
