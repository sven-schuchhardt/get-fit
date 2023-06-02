
import { Tab } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { DefaultListOfPlans, ListOfPlans } from "./StrengthTrainingPage";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export const ExercisePlanTabs = () => {
    const [value, setValue] = useState("0");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
    };
  
    return (
      <Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              arial-label="Exercise Category"
              onChange={handleChange}
              textColor="secondary"
              centered
            >
              <Tab label="Your Exercise Plans" value="0" />
              <Tab label="Default Exercise Plans" value="1" />
            </TabList>
          </Box>
          <TabPanel value="0">
            <ListOfPlans />
          </TabPanel>
          <TabPanel value="1">
            <DefaultListOfPlans />
          </TabPanel>
        </TabContext>
      </Box>
    );
  };