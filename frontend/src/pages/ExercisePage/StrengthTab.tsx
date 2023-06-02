import { Button } from "@mui/material";
import { Box } from "@mui/system";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { useApiClient } from "../../adapter/api/useApiClient";
import React, { Component, useState } from "react";
import MaterialTable from "@material-table/core";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { WeightTrainingExercise } from "../../adapter/api/__generated/api";
import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const StrengthTab = () => {
  const api = useApiClient();
  const auth = getAuth(app);
  const [weightExercises, setWeightExercise] = useState<
    WeightTrainingExercise[]
  >([]);

  const fetchData = async (user) => {
    try {
      const data = await api.getWeightTrainingExerciseAll(user.accessToken);
      setWeightExercise(data.data);
    } catch (e) {}
  };
  const fetchDefault = async () => {
    try {
      const data = await api.getWithoutAuthWeightTrainingExercisesAllDefault();
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
        fetchDefault();
      }
    });
  }, []);

  const navigate = useNavigate();
  const routeChangeDetails = (exerciseId) => {
    let path = `/exercisepage/info`;
    navigate(path, { state: { id: exerciseId } });
  };
  const routeChangeAdd = (exerciseId) => {
    let path = `/exercise/add`;
    navigate(path);
  };
  return (
    <Box>
      <Box display="flex" justifyContent="end" alignItems="end" margin={2}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<AddCircleOutline />}
          onClick={routeChangeAdd}
        >
          add your own exercise
        </Button>
      </Box>
      <MaterialTable
        options={{
          pageSize: 10,
          filtering: true,
        }}
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
        ]}
        title="Exercises:"
      />
    </Box>
  );
};
