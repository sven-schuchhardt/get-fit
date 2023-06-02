import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { StrengthTab } from "./StrengthTab";

export const TabSection = () => {
  const [value, setValue] = useState("0");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList
          arial-label="Exercise Category"
          onChange={handleChange}
          textColor="secondary"
          centered
        >
          <Tab label="Strength" value="0" />
          <Tab label="Yoga" value="1" />
        </TabList>
      </Box>
      <TabPanel value="0">
        <StrengthTab />
      </TabPanel>
      <TabPanel value="1">Yoga</TabPanel>
    </TabContext>
  );
};
