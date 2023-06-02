import {
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState } from "react";
import { useApiClient } from "../../adapter/api/useApiClient";
import { WeightTrainingExercisePlan } from "../../adapter/api/__generated";

export const PlanTable = ({ id }) => {
  const api = useApiClient();
  const auth = getAuth(app);
  const exercisePlanId = id;

  const [exercisePlan, setExercisePlan] =
    useState<WeightTrainingExercisePlan>();
  const fetchData = async (user) => {
    const data = await api.getWeightTrainingExercisePlanOne(
      user.accessToken,
      exercisePlanId
    );
    setExercisePlan(data.data);
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      } else {
      }
    });
  }, []);

  const title = "ExercisePlan: " + exercisePlan?.title;

  return (
    <Box sx={{}} paddingLeft={6} paddingTop={10}>
      <Card
        sx={{
          backgroundColor: "primary.main",
          margin: 3,
          display: "inline-flex",
        }}
      >
        <CardContent>{title}</CardContent>
      </Card>
      {exercisePlan && (
        <TableContainer component={Paper} sx={{ maxHeight: "300px" }}>
          <Table
            aria-label="active exercise plan"
            stickyHeader
            sx={{ backgroundColor: "secondary.main" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Exercise</TableCell>
                <TableCell>Sets</TableCell>
                <TableCell>Reps</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exercisePlan.exercises.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&&:last:child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.days[0]}</TableCell>
                  <TableCell>{row.exercise.name}</TableCell>
                  <TableCell>{row.setAmount}</TableCell>
                  <TableCell>{row.repetition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
