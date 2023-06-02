import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { AppHeader } from "../../components/AppHeader";
import { WeightExercisePlanAddForm } from "./WeightExercisePlanForm";

export const AddWeightExercisePlan = () => {
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
          <WeightExercisePlanAddForm />
        </Grid>
      </Grid>
    </Grid>
  );
};
