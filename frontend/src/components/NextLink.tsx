import { Link } from "@material-ui/core";
import NLink from "next/link";
import React from "react";

interface NextLinkProps {
  href: string;
}

const NextLink: React.FC<NextLinkProps> = ({ href, children }) => {
  return (
    <NLink href={href}>
      <Link style={{ cursor: "pointer" }}>{children}</Link>
    </NLink>
  );
};

export default NextLink;
