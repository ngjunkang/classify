import { Box } from "@material-ui/core";
import React from "react";

interface TabPanelProps {
  index: any;
  value: any;
}

const TabPanel: React.FC<TabPanelProps> = ({
  index,
  value,
  children,
  ...props
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...props}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
