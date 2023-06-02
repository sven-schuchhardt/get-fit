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
} from "@mui/material";
import { Box } from "@mui/system";
import { app } from "../../FirebaseAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useApiClient } from "../../adapter/api/useApiClient";
import { IconPopOver } from "./IconPopOver";

export const UserPlans = (plan) => {
  const auth = getAuth(app);
  const api = useApiClient();
  const exercisePlan = plan.exercisePlan;

  return (
    <Box sx={{}} paddingLeft={6} paddingTop={10}>
      <Card
        sx={{
          marginBottom: 2,
          backgroundColor: "primary.main",
          display: "inline-flex",
          zIndex: "1",
        }}
      >
        <CardContent>{exercisePlan.title}: </CardContent>
      </Card>

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
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.exercise.name}</TableCell>
                <TableCell>{row.setAmount}</TableCell>
                <TableCell>{row.repetition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <IconPopOver id={exercisePlan.id}/>
    </Box>
  );
};
