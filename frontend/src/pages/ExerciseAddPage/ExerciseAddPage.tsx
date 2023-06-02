import { useTheme } from "@emotion/react";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { AddExercisesForm } from "./AddExercisesForm";
import { AppHeader } from "../../components/AppHeader";
import { app } from "../../FirebaseAuthentication";
import { getAuth } from "@firebase/auth";
import { WeightTrainingExercise } from "../../adapter/api/__generated";
import { useApiClient } from "../../adapter/api/useApiClient";

export const ExerciseAddPage = () => {
  const theme = useTheme();
  const auth = getAuth(app);

  const [authState, setAuthState] = useState(false);


  //auth.currentUser;

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
          <AddExercisesForm />
        </Grid>
      </Grid>
    </Grid>
  );
};
