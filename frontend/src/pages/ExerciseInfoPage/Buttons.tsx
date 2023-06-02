import { Button, IconButton, Popover, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const Buttons = (exerciseProp) => {
  const exercise = exerciseProp.exercise;

  let navigate = useNavigate();
  const toEditExercise = () => {
    navigate("/exercise/edit", { state: { exercise } });
  };

  const [anchor, setAnchor] = useState(null);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        justifyContent: "space-between",
        marginLeft: 4,
        paddingBottom: 4,
      }}
    >
      <IconButton
        onClick={toEditExercise}
        sx={{ border: "solid 2px", backgroundColor: "primary.main" }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={handleClick}
        sx={{ border: "solid 2px", backgroundColor: "error.main" }}
      >
        <DeleteIcon />
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        onClose={handleClose}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Typography color="secondary.main">
          Wollen Sie ihre Übung wirklich löschen?
        </Typography>
        <Button sx={{ backgroundColor: "error.main", color: "secondary.main" }}>
          Yes
        </Button>
        <Button
          onClick={handleClose}
          sx={{ backgroundColor: "primary.main", color: "secondary.main" }}
        >
          No
        </Button>
      </Popover>
    </Box>
  );
};
