import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/dashboard/layout";
import { Metadata } from "next";

const keywords = [
  ...(mainMetadata.keywords || []),
  "required documents",
  "documents",
  "file upload",
  "client requirements",
  "service request",
  "document management",
  "verification",
];

export const metadata: Metadata = {
  title: {
    default: "Required Documents",
    template: "%s | Waraqati",
  },
  description:
    "Manage required documents that clients need to upload when requesting services in Waraqati.",
  keywords,
  openGraph: {
    title: "Required Documents | Waraqati",
    description:
      "Set and manage the documents that clients must upload when submitting service requests in Waraqati.",
  },
};

const RequiredDocumentsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default RequiredDocumentsLayout;