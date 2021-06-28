import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import NextLink from "next/link";

interface SideBarProps {
  open: boolean;
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

const routes = [
  { label: "Whiteboard", route: "/whiteboard" },
  { label: "Cliques", route: "/class/cliques" },
];

const SideBar: React.FC<SideBarProps> = ({ open, toggleDrawer }) => {
  const classes = useStyles();

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          {routes.map(({ label, route }, index) => (
            <NextLink href={route} key={index}>
              <ListItem button>
                <ListItemText primary={label} />
              </ListItem>
            </NextLink>
          ))}
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Report bugs"
              onClick={() =>
                window.open(
                  "https://forms.gle/aTP65LHmboyWeG1r7",
                  "_blank",
                  "noopener noreferrer"
                )
              }
            />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default SideBar;
