import {
  Card,
  CardContent,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  IconButton,
  Popover,
  Button,
} from "@mui/material";
import { Box, maxWidth, padding } from "@mui/system";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppHeader } from "../../components/AppHeader";
import { SectionHeading } from "../../components/SectionHeading";
import { AppFooter } from "../../components/Footer";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ActiveExercisePlan } from "./ActiveExercisePlan";
import { ExercisePlanTabs } from "./ExercisePlanTabs";
import { IconPopOver } from "./IconPopOver";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { UserPlans } from "./UserPlan";
import { WeightTrainingExercisePlan } from "../../adapter/api/__generated";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useApiClient } from "../../adapter/api/useApiClient";
import { app } from "../../FirebaseAuthentication";
import { DefaultPlans } from "./DefaultPlan";

export const StrengthTrainingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(false);
  const routeChangeAdd = (exerciseId) => {
    let path = `/strengthtraining/add`;
    navigate(path);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      <Box
        sx={{
          backgroundImage: `url(${"../src/assets/background.jpg"})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "30vh",
          zIndex: 2,
        }}
      >
        <AppHeader />
        <Box sx={{ width: 150, height: 125 }}></Box>
      </Box>
      <Grid container spacing={3} direction="row" padding={5}>
        <Grid item xs={6}>
          <ActiveExercisePlan />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        endIcon={<AddCircleOutline />}
        onClick={routeChangeAdd}
        sx={{ margin: 2 }}
      >
        add an exercise plan
      </Button>
      <SectionHeading heading="Plans" />
      <ExercisePlanTabs />
      <AppFooter />
    </Box>
  );
};

export const ListOfPlans = () => {
  const auth = getAuth(app);
  const api = useApiClient();
  const [exercisePlans, setExercisePlans] = useState<
    WeightTrainingExercisePlan[]
  >([]);

  const fetchData = async (user) => {
    try {
      const data = await api.getWeightTrainingExercisePlanAll(user.accessToken);
      setExercisePlans(data.data);
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
    <Box>
      {exercisePlans.map((entry) => (
        <Grid container spacing={2} direction="row" sx={{ widht: "100%" }}>
          <Grid item xs={6}>
            <UserPlans exercisePlan={entry} />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export const DefaultListOfPlans = () => {
  const auth = getAuth(app);
  const api = useApiClient();
  const [defaultPlans, setDefaultPlans] = useState<
    WeightTrainingExercisePlan[]
  >([]);

  const fetchData = async (user) => {
    try {
      const data = await api.getWeightTrainingExercisePlanAllDefaultByUser(
        user.accessToken
      );
      setDefaultPlans(data.data);
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
    <Box>
      {defaultPlans.map((entry) => (
        <Grid container spacing={2} direction="row" sx={{ widht: "100%" }}>
          <Grid item xs={6}>
            <DefaultPlans exercisePlan={entry} />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};
