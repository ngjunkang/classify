import React from "react";
import { Box } from "@material-ui/core";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxWidth={variant === "regular" ? "800px" : "400px"}
      width="100%"
      padding={1}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
