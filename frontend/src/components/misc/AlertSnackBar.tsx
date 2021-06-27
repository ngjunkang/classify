import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";

interface AlertSnackBarProps {
  handleClose: () => void;
  open: boolean;
  success: boolean;
  message: string;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AlertSnackBar: React.FC<AlertSnackBarProps> = ({
  open,
  handleClose,
  success,
  message,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={success ? "success" : "error"}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackBar;
