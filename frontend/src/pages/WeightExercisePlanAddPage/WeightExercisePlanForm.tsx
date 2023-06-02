import React, { useState } from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { useApiClient } from "../../adapter/api/useApiClient";
import { WeightTrainingExercise } from "../../adapter/api/__generated";
import { app } from "../../FirebaseAuthentication";
import { getAuth } from "@firebase/auth";

import { PlanTable } from "./PlanTable";
import { Box } from "@mui/system";

export const WeightExercisePlanAddForm = () => {
  const auth = getAuth(app);
  const api = useApiClient();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(false);
  const [user, setUser] = useState();
  const [exercisePlanCreated, setExercisePlanCreated] = useState(false);

  const [state, setState] = React.useState({
    title: "",
    description: "",
  });

  type WeighTrainingPlanData = {
    title: string;
    description: string;
  };

  const createPlan = async (user, exercisePlanDTO: WeighTrainingPlanData) => {
    try {
      const data = await api.postWeightTrainingExercisePlan(
        user.accessToken,
        exercisePlanDTO
      );
      setExercisePlanCreated(true);
      let path = `/strengthtraining/edit/` + data.data.id;
      navigate(path);
    } catch (e) {}
  };

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  function onSubmitCreate(event) {
    event.preventDefault();
    createPlan(auth.currentUser, state);
  }

  return (
    <Box>
      <h2>Add your exercise plan</h2>
      <form onSubmit={onSubmitCreate}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <label>Title: </label>
          </Grid>
          <Grid item>
            <input
              type="text"
              name="title"
              value={state.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <label>Description: </label>
          </Grid>
          <Grid item>
            <textarea
              name="description"
              rows={4}
              cols={40}
              value={state.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <button type="submit">Create Plan</button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
