import { Button, Grid, Popover, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { WeightTrainingExercise } from "../../adapter/api/__generated";
import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useApiClient } from "../../adapter/api/useApiClient";
import { useNavigate } from "react-router";

export const PopOverAdd = ({ id, exercisePlan }) => {
  const auth = getAuth(app);
  const api = useApiClient();
  const exerciseId = id.id;
  const [weightExercises, setWeightExercise] =
    useState<WeightTrainingExercise>();

  const fetchData = async (user) => {
    try {
      const data = await api.getWeightTrainingExerciseOne(
        user.accessToken,
        exerciseId
      );
      setWeightExercise(data.data);
    } catch (e) {}
  };
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      } else {
      }
    });
  }, []);

  const [anchor, setAnchor] = useState(null);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const [formData, setFormData] = useState();

  const childToParent = (formData) => {
    setFormData(formData);
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        endIcon={<AddCircleOutline />}
      >
        add exercise to your plan
      </Button>
      <Popover
        open={Boolean(anchor)}
        onClose={handleClose}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <FormAmountRepetition
          weightExercise={weightExercises}
          childToParent={childToParent}
          planId={exercisePlan}
        />
      </Popover>
    </Box>
  );
};

export const FormAmountRepetition = ({
  weightExercise,
  childToParent,
  planId,
}) => {
  const api = useApiClient();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const exercisePlanId = planId;
  const exerciseName = weightExercise.name;
  const [state, setState] = React.useState({
    weightTrainingExercise: weightExercise.id,
    setAmount: 0,
    repetition: 0,
    days: ["mon"],
  });

  function handleChange(evt) {
    const value = evt.target.value;
    if (evt.target.name == "days") {
      setState({
        ...state,
        [evt.target.name]: [value],
      });
    } else {
      setState({
        ...state,
        [evt.target.name]: value,
      });
    }
  }

  function onSubmit(event) {
    try {
      editExercisePlan(state);
    } catch (e) {}
  }

  type UpdateExerciseDTO = {
    weightTrainingExercise: string;
    setAmount: number;
    repetition: number;
    days: string[];
  };

  function editExercisePlan(exerciseDTO: UpdateExerciseDTO) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        editExercise(user, exercisePlanId, exerciseDTO);
      }
    });
  }

  const editExercise = async (
    user,
    exercisePlanId,
    exercise: UpdateExerciseDTO
  ) => {
    try {
      const data = await api.putWeightTrainingExercisePlanAddExercises(
        user.accessToken,
        exercisePlanId,
        exercise
      );
      let path = `/strengthtraining/edit/` + exercisePlanId;
      navigate(path);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2} direction="row">
        <Grid item>
          <Typography>{exerciseName}</Typography>
        </Grid>
        <Grid item>
          <label>Sets: </label>
        </Grid>
        <Grid item>
          <input
            type="text"
            name="setAmount"
            value={state.setAmount}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <label>Reps: </label>
        </Grid>
        <Grid item>
          <input
            type="text"
            name="repetition"
            value={state.repetition}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <select name="days" onChange={handleChange} value={state.days}>
            {days.map((entry) => (
              <option value={entry}>{entry}</option>
            ))}
          </select>
        </Grid>
        <button type="submit">Add</button>
      </Grid>
    </form>
  );
};

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
