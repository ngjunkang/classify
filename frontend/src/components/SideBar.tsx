import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

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
  { label: "Home", route: "/", isPublic: true },
  { label: "Whiteboard", route: "/whiteboard", isPublic: true },
  { label: "Cliques", route: "/class/cliques", isPublic: true },
  { label: "My Cliques", route: "/class/cliques/mine", isPublic: false },
];

const SideBar: React.FC<SideBarProps> = ({ open, toggleDrawer }) => {
  const classes = useStyles();
  const [{ data, fetching }] = useMeQuery();

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          {routes.map(({ label, route, isPublic }, index) => {
            if (!isPublic && (fetching || (!fetching && !data?.me))) {
              return null;
            }

            return (
              <NextLink href={route} key={index}>
                <ListItem button>
                  <ListItemText primary={label} />
                </ListItem>
              </NextLink>
            );
          })}
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Report bugs"
              onClick={() =>
                window.open(
                  "https://github.com/ngjunkang/classify/issues",
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
