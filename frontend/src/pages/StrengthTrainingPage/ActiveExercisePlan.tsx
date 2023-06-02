import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useApiClient } from "../../adapter/api/useApiClient";
import React, { useState } from "react";
import {
  User,
  WeightTrainingExercisePlan,
} from "../../adapter/api/__generated/api";

import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

export const ActiveExercisePlan = () => {
  const auth = getAuth(app);

  const api = useApiClient();
  const [userObject, setUserObject] = useState<User>();

  const [activePlan, setActivePlan] = useState<WeightTrainingExercisePlan>();

  const fetchData = async (user) => {
    try {
      const data = await api.getUserId(user.accessToken);
      setUserObject(data.data);
      if (data.data) {
        const planData = await api.getWeightTrainingExercisePlanOne(
          user.accessToken,
          data.data.activePlan.id
        );
        setActivePlan(planData.data);
      }
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

  return (
    <Box sx={{}} paddingLeft={6} paddingTop={10}>
      <Box>
        <Grid container spacing={10} direction="row">
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Card
                  sx={{
                    backgroundColor: "primary.main",
                    margin: 3,
                    display: "inline-flex",
                  }}
                >
                  <CardContent>
                    <Typography>
                      Active Exercise Plan: {activePlan?.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                {userObject && (
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
                        {activePlan &&
                          activePlan.exercises.map((row) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                "&&:last:child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell>{row.days}</TableCell>
                              <TableCell>{row.exercise.name}</TableCell>
                              <TableCell>{row.setAmount}</TableCell>
                              <TableCell>{row.repetition}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Card
              sx={{
                backgroundColor: "primary.main",
                margin: 3,
                display: "inline-flex",
              }}
            >
              <CardContent>
                <Typography>Description: </Typography>
              </CardContent>
            </Card>

            <Paper>{activePlan?.description}</Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
