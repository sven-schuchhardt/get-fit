import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  IconButton,
  Popover,
  Button,
  TextField,
} from "@mui/material";
import { AppHeader } from "../../components/AppHeader";
import { Box, display, margin } from "@mui/system";

import { useLocation, useNavigate } from "react-router-dom";

import { InformationSection } from "./InformationSection";

import { useApiClient } from "../../adapter/api/useApiClient";
import { WeightTrainingExercise } from "../../adapter/api/__generated/api";
import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const ExerciseInfoPage = () => {
  const api = useApiClient();
  const auth = getAuth(app);
  const [exercise, setExercise] = useState<WeightTrainingExercise>();
  const [isLoading, setLoading] = useState(true);
  const fetchData = async (user) => {
    //TODO USER->WEIGHTEXERCISE
    const data = await api.getWeightTrainingExerciseOne(
      user.accessToken,
      exerciseID
    );
    setExercise(data.data);
    setLoading(false);
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      } else {
      }
    });
  }, []);

  const location = useLocation();
  let createdByUser = "default";
  const exerciseID = location.state.id;

  if (exercise?.createdByUser) {
    createdByUser = "CreatedByUser";
  }
  if (!exercise) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  return (
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
      <Box sx={{ width: 150, height: 125 }}></Box>
      <Box sx={{}}>
        <Card
          sx={{
            backgroundColor: "primary.main",
            margin: 3,
            display: "inline-flex",
          }}
        >
          <CardContent>
            <Typography>{exercise?.name}</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            backgroundColor: "#303f9f",
            margin: 3,
            display: "inline-flex",
          }}
        >
          <CardContent>
            <Typography>{createdByUser}</Typography>
          </CardContent>
        </Card>
      </Box>
      <InformationSection exercise={exercise} />
    </Box>
  );
};
