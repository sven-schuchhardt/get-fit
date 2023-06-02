import { Box } from "@mui/system";
import { WeightExerciseSelection } from "./WeightExerciseSelection";
import { Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { PlanTable } from "./PlanTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const AddExerciseSection = () => {
  const params = useParams();

  const navigation = useNavigate();
  const exercisePlanId = params.id;

  function handleClick() {
    let path = "/strengthtraining";
    navigation(path);
  }

  return (
    <Grid container spacing={4} direction="column">
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
        ></Box>
      </Grid>

      <Grid item margin={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          startIcon={<ArrowBackIcon />}
        >
          go back to your plans
        </Button>
      </Grid>
      <PlanTable id={exercisePlanId} />
      <Grid item margin={4}>
        <WeightExerciseSelection id={params.id} />
      </Grid>
    </Grid>
  );
};
