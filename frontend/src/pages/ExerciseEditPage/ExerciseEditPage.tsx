import { useTheme } from "@emotion/react";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AppHeader } from "../../components/AppHeader";
import { EditExercisesForm } from "./EditExerciseForm";

export const ExerciseEditPage = () => {
  const theme = useTheme();
  const [authState, setAuthState] = useState(false);

  const location = useLocation();
  const exercise = location.state
  return (
    <Grid container direction="column">
      <Grid item>
        <Box
          sx={{
            backgroundImage: `url(${"../src/assets/background.jpg"})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "30vh",
            width: "100%",
          }}
        >
          <AppHeader />
        </Box>
        <Grid item>
          <EditExercisesForm exercise={exercise} />
        </Grid>
      </Grid>
    </Grid>
  );
};
