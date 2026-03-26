import React from "react";
import { Metadata } from "next";
import { metadata as mainMetadata } from "@/app/layout";
import { CommonParentProps } from "@/types/global";

const keywords = [
  ...(mainMetadata.keywords || []),
  "available requests",
  "unassigned requests",
  "employee tasks",
  "open requests",
  "request queue",
];

export const metadata: Metadata = {
  title: {
    default: "Available Requests",
    template: "%s | Waraqati",
  },
  description:
    "Browse and manage available service requests that are not yet assigned to any employee. Pick tasks and start working efficiently.",
  keywords,
  openGraph: {
    title: "Available Requests | Waraqati",
    description:
      "Explore unassigned requests and start working on tasks available in the system.",
  },
};

const AvailableRequestsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return (
    <React.Fragment >
      {children}
    </React.Fragment>
  );
};

export default AvailableRequestsLayout;