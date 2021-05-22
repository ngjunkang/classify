import { Box, Button, CircularProgress } from "@material-ui/core";
import React from "react";

interface LoadingButtonProps {
  isLoading: boolean;
  type: "submit" | "reset" | "button";
  disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  ...props
}) => {
  return (
    <Box mt={2} textAlign="center">
      <Button {...props} disabled={props.disabled || isLoading} color="primary">
        {isLoading ? (
          <CircularProgress color="secondary" size="20px" />
        ) : (
          children
        )}
      </Button>
    </Box>
  );
};

export default LoadingButton;
