import { Tabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: "60%",
      width: "100%",
      backgroundColor: "#fff",
    },
  },
})((props: StyledTabsProps) => (
  <Tabs
    key={props.value}
    {...props}
    TabIndicatorProps={{ children: <span /> }}
  />
));

export default StyledTabs;
