import {
  Box,
  ListItemAvatar,
  ListItemText,
  Typography,
  List,
  ListItem,
  Theme,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Warning } from "@material-ui/icons";
import React from "react";

interface DataLoadingErrorProps {
  text: string;
  className: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      width: 50,
      height: 50,
    },
  })
);

const DataLoadingError: React.FC<DataLoadingErrorProps> = ({
  text,
  className,
}) => {
  const classes = useStyles();
  return (
    <Box className={className}>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Warning className={classes.icon} />
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="h6">{text}</Typography>}
          ></ListItemText>
        </ListItem>
      </List>
    </Box>
  );
};

export default DataLoadingError;
