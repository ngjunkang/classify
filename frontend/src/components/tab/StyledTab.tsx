import React from "react";
import { Tab, Theme, TabProps } from "@material-ui/core";
import { withStyles, createStyles } from "@material-ui/core/styles";

interface StyledTabProps {
  label: string;
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      color: "#fff",
      backgroundColor: "#635ee7",
      borderStartEndRadius: 8,
      borderStartStartRadius: 8,
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: 2,
      "&:focus": {
        opacity: 1,
      },
    },
  })
)(({ label, ...props }: StyledTabProps & TabProps) => (
  <Tab key={label} label={label} {...props} />
));

export default StyledTab;
