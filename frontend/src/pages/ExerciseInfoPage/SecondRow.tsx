import { Grid } from "@mui/material";
import { Cards } from "../../components/Cards";

export const SecondRow = (exerciseProp) => {
  const exercise = exerciseProp.exercise;
  return (
    <Grid container spacing={10} direction="row">
      <Grid item xs={6}>
        <Cards title="Target muscle" text={exercise.muscleGroup} />
      </Grid>
      <Grid item xs={6}>
        <Cards title="Equipment" text={exercise.equipment} />
      </Grid>
    </Grid>
  );
};
