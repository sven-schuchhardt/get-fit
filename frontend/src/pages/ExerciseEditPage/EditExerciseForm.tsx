
import { Box } from "@mui/system";
import React, { useState } from "react";

import { Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { useApiClient } from "../../adapter/api/useApiClient";

import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const EditExercisesForm = (exerciseProp) => {
  const exercise = exerciseProp.exercise.exercise;
  const exerciseId = exerciseProp.exercise.exercise.id;
  const api = useApiClient();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [authState, setAuthState] = useState(false);

  const [state, setState] = React.useState({
    name: exercise.name,
    description: exercise.description,
    videoLink: exercise.videoLink,
    imageOrGifUrl: exercise.imageOrGifUrl,
    muscleGroup: exercise.muscleGroup,
    equipment: exercise.equipment,
  });
  const [stateBodyPart, setStateBodyPart] = React.useState({
    bodyPart: exercise.bodyPart,
  });

  type WeightExerciseData = {
    name: string;
    description: string;
    videoLink: string;
    imageOrGifUrl: string;
    muscleGroup: string;
    equipment: string;
  };

  type BodyPartData = {
    bodyPart: string;
  };

  const bodyPartList = [
    "chest",
    "back",
    "cardio",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist",
    "quads",
  ];

  type Body = {
    names: string[];
  };
  const fetchData = async (user, editExercise: WeightExerciseData) => {
    const userToken = user.accessToken;
    try {
      const data = await api.putWeightTrainingExerciseUpdateExercise(
        userToken,
        exerciseId,
        editExercise
      );
    } catch (e) {
      //TODO snackbar wenn nicht erfolgreich
      console.log(e);
    }
    try {
      if (exercise.bodyPart != stateBodyPart.bodyPart) {
        const bodyPartArray: Body = {
          names: [stateBodyPart.bodyPart],
        };
        const bodyPartObject = await api.getBodyPartMulti(
          userToken,
          bodyPartArray
        );
        const bodyPartDTO: BodyPartData = {
          bodyPart: "bodyPartObject.id",
        };
        const dataBodyPart = await api.putWeightTrainingExerciseUpdateBodyPart(
          user.accessToken,
          exerciseId,
          bodyPartDTO
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  function onSubmit() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user, state);
        let path = `/exercisepage`;
        navigate(path);
      } else {
      }
    });
  }
  function handleChange(evt) {
    const value = evt.target.value;
    if (evt.target.name != "bodyPart") {
      setState({
        ...state,
        [evt.target.name]: value,
      });
    } else {
      setStateBodyPart({
        ...stateBodyPart,
        [evt.target.name]: value,
      });
    }
  }

  return (
    <Box>
      <h2>Edit your exercise</h2>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <label>Name: </label>
          </Grid>
          <Grid item>
            <input
              type="text"
              name="name"
              value={state.name}
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
            <label>VideoId(you have to enter a videoId): </label>
          </Grid>
          <Grid item>
            <input
              type="text"
              name="videoUrl"
              value={state.videoLink}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <label>Image: </label>
          </Grid>
          <Grid item>
            <input
              type="text"
              name="imageOrGifUrl"
              value={state.imageOrGifUrl}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <label>Muscle Group: </label>
          </Grid>
          <Grid item>
            <input
              type="text"
              name="muscleGroup"
              value={state.muscleGroup}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <label>Equipment: </label>
          </Grid>
          <Grid item>
            <input
              type="text"
              name="equipment"
              value={state.equipment}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <select
              name="bodyPart"
              onChange={handleChange}
              value={stateBodyPart.bodyPart}
            >
              {bodyPartList.map((entry) => (
                <option value={entry}>{entry}</option>
              ))}
            </select>
          </Grid>
          <Grid item>
            <button type="submit">Submit</button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
