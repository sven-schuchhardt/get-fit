import { Box } from "@mui/system";
import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { useApiClient } from "../../adapter/api/useApiClient";
import {
  BodyPart,
  WeightTrainingExercise,
} from "../../adapter/api/__generated";
import { StrengthTab } from "../ExercisePage/StrengthTab";
import MaterialTable from "@material-table/core";
import InfoIcon from "@mui/icons-material/Info";
import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { PopOverAdd } from "./PopOverAdd";

export const WeightExerciseSelection = (id) => {
  const api = useApiClient();
  const auth = getAuth(app);
  const [weightExercises, setWeightExercise] = useState<
    WeightTrainingExercise[]
  >([]);

  const fetchData = async (user) => {
    try {
      const data = await api.getWeightTrainingExerciseAll(user.accessToken);
      setWeightExercise(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      } else {
      }
    });
  }, []);

  //-------------------
  const [searched, setSearched] = useState("");
  const [cards, setCards] = useState(weightExercises);

  {
    cards.map((entry) => console.log("NAME " + entry.name));
  }
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const requestSearch = (searchedVal) => {
    const filteredCards = weightExercises.filter((card) => {
      return card.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setCards(filteredCards);
  };

  //-----------------------------------------------

  const routeChangeDetails = (exerciseId) => {
    let path = `/exercisepage/info`;
    navigate(path, { state: { id: exerciseId } });
  };
  const routeChangeAdd = (exerciseId) => {
    let path = `/exercise/add`;
    navigate(path);
  };

  const navigate = useNavigate();
  const [authState, setAuthState] = useState(false);

  function addExerciseRoute(id) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //const data = api.putWeightTrainingExercisePlanUpdateExercises(user)
      } else {
      }
    });
  }

  function openPopUp(id) {
    //<PopOverAdd />;
  }

  return (
    <MaterialTable
      data={weightExercises}
      columns={[
        {
          title: "Image",
          field: "imageOrGifUrl",
          filtering: false,
          render: (rowData) => {
            return (
              <Box
                display="flex"
                component="img"
                sx={{
                  height: 200,
                  width: 200,
                  backgroundColor: "#5F6367",
                }}
                alt="ExerciseImage."
                src={rowData.imageOrGifUrl}
              />
            );
          },
        },
        { title: "Id", field: "id", filtering: false, hidden: true },
        { title: "Name", field: "name", filtering: false },
        {
          title: "BodyPart",
          field: "bodyPart.bodyPart",
          lookup: {
            chest: "chest",
            back: "back",
            cardio: "cardio",
            "lower arms": "lower arms",
            lower_legs: "lower legs",
            neck: "neck",
            shoulders: "shoulders",
            "upper arms": "upper arms",
            "upper legs": "upper legs",
            waist: "waist",
            quads: "quads",
          },
        },
        {
          title: "Default Exercise",
          field: "createdByUser",
          lookup: {
            true: "your exercise",
            false: "default exercise",
          },
        },
        {
          title: "Details",
          render: (rowData) => {
            return (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => routeChangeDetails(rowData.id)}
                  endIcon={<InfoIcon />}
                >
                  show more
                </Button>
              </Box>
            );
          },
        },
        {
          title: "Add Exercise",
          render: (rowData) => {
            return (
              <Box marginRight={4}>
                <PopOverAdd id={rowData} exercisePlan={id.id} />
              </Box>
            );
          },
        },
      ]}
      title="Exercises:"
    />
  );
};
