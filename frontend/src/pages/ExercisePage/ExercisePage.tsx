import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Grid,
  List,
  ListItem,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  Popover,
} from "@mui/material";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, display, margin } from "@mui/system";
import { AppFooter } from "../../components/Footer";
import { AppHeader } from "../../components/AppHeader";
import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InfoIcon from "@mui/icons-material/Info";

import { HomePage } from "../HomePage";
import { useNavigate } from "react-router-dom";
import { StrengthTab } from "./StrengthTab";
import { TabSection } from "./TabSection";
import Search from "@mui/icons-material/Search";

import { useApiClient } from "../../adapter/api/useApiClient";

export const ExercisePage = () => {
  const theme = useTheme();

  const [authState, setAuthState] = useState(false);

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
      </Box>
      <Box>
        <TabSection />
      </Box>
      <AppFooter />
    </Box>
  );
};
