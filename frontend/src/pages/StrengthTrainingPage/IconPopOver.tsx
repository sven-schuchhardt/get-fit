import { Grid, IconButton, Popover } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useApiClient } from "../../adapter/api/useApiClient";

export const IconPopOver = (id) => {
  const api = useApiClient();
  const auth = getAuth(app);
  const [anchor, setAnchor] = useState(null);

  const exercisePlanId = id.id;

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  let navigate = useNavigate();
  const handleEditButton = () => {
    let path = `/exercise/edit`;
    navigate(path);
  };

  const handleSetActive = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setActivePlan(user);
      } else {
      }
    });
  };

  const setActivePlan = async (user) => {
    const accessToken = user.accessToken;
    try {
      const data = await api.putUserUpdateActivePlanId(
        exercisePlanId,
        accessToken
      );
      window.location.reload();
    } catch (e) {}
  };
  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{ border: "solid 2px", backgroundColor: "primary.main" }}
      >
        <MenuIcon />
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
        <Grid container direction="column">
          <Grid item>
            <IconButton
              sx={{ border: "solid 2px", backgroundColor: "primary.main" }}
            >
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleSetActive}
              sx={{ border: "solid 2px", backgroundColor: "green" }}
            >
              <CheckCircleRoundedIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              sx={{ border: "solid 2px", backgroundColor: "error.main" }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Popover>
    </Box>
  );
};
