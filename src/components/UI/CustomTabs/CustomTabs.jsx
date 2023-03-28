import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

const CustomTabs = ({ videoInfo, event, onDurationChange, playlistId }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs>
          <Tab sx={{ color: "#fff" }} label="Overview" />
          <Tab sx={{ color: "#fff" }} label="Notes" />
        </Tabs>
      </Box>
    </Box>
  );
};

export default CustomTabs;
