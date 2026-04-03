import React from "react";
import { Metadata } from "next";
import { metadata as mainMetadata } from "@/app/layout";
import { CommonParentProps } from "@/types/global";

const keywords = [
  ...(mainMetadata.keywords || []),
  "assigned requests",
  "employee tasks",
  "in progress requests",
  "reviewed requests",
  "finished requests",
  "completed tasks",
  "work on requests",
];

export const metadata: Metadata = {
  title: {
    default: "My Tasks",
    template: "%s | Waraqati",
  },
  description:
    "Manage your assigned service requests. Track progress, review tasks, and complete your work efficiently across all stages.",
  keywords,
  openGraph: {
    title: "My Tasks | Waraqati",
    description:
      "View and manage your assigned requests including reviewed, in-progress, and completed tasks.",
  },
};

const EmployeeRequestsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default EmployeeRequestsLayout;