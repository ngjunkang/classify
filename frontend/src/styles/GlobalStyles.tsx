import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useGlobalStyles = makeStyles((theme: Theme) =>
  createStyles({
    pointerOnLink: {
      cursor: "pointer",
    },
  })
);

export default useGlobalStyles;
