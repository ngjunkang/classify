import { Box, Button, CircularProgress } from "@material-ui/core";
import React from "react";

interface LoadingButtonProps {
  isLoading: boolean;
  type: "submit" | "reset" | "button";
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  ...props
}) => {
  return (
    <Box mt={2} textAlign="center">
      <Button {...props} color="primary">
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
