import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
} from "@material-ui/core";

interface ConfirmationDialogProps {
  handleProceed: () => void;
  handleClose: () => void;
  open: boolean;
  dialogTitle: string;
  diaglogContent: string;
  dialogCancelBtnTitle: string;
  dialogProceedBtnTitle: string;
  maxWidth: DialogProps["maxWidth"];
}

const ConfirmationDialog: React.FC<any> = (props: ConfirmationDialogProps) => {
  let maxWidth = "sm" as DialogProps["maxWidth"];
  if (props.maxWidth !== undefined) {
    maxWidth = props.maxWidth;
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth={true}
      maxWidth={maxWidth}
    >
      <DialogTitle>{props.dialogTitle}</DialogTitle>

      <DialogContent>
        <DialogContentText>{props.diaglogContent}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.handleClose}>
          {props.dialogCancelBtnTitle}
        </Button>
        <Button onClick={props.handleProceed}>
          {props.dialogProceedBtnTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
