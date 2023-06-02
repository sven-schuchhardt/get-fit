
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { useApiClient } from "../../adapter/api/useApiClient";
import { BodyPart } from "../../adapter/api/__generated";
import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AddExercisesForm = () => {
  const api = useApiClient();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [authState, setAuthState] = useState(false);
  const [state, setState] = React.useState({
    name: "",
    description: "",
    videoLink: "",
    imageOrGifUrl: "",
    muscleGroup: "",
    equipment: "",
    bodyPart: "back",
  });

  type WeightExerciseData = {
    name: string;
    description: string;
    videoLink: string;
    imageOrGifUrl: string;
    muscleGroup: string;
    equipment: string;
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

  const fetchData = async (user, exercise: WeightExerciseData) => {
    try {
      const data = await api.postWeightTrainingExercise(
        user.accessToken,
        exercise
      );
      console.log(data.data);
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
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  return (
    <Box>
      <h2>Add your exercise</h2>
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
            <label>Video(you have to enter a videoId): </label>
          </Grid>
          <Grid item>
            <input
              type="text"
              name="videoLink"
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
            <label>Body Part: </label>
          </Grid>
          <Grid item>
            <select
              name="bodyPart"
              onChange={handleChange}
              value={state.bodyPart}
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
