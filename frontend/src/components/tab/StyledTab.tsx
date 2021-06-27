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
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      "&:focus": {
        opacity: 1,
      },
    },
  })
)(({ label, ...props }: StyledTabProps & TabProps) => (
  <Tab label={label} {...props} />
));

export default StyledTab;
