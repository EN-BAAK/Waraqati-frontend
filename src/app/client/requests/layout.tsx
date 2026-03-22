import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/dashboard/layout";
import { Metadata } from "next";

const keywords = [
  ...(mainMetadata.keywords || []),
  "requests",
  "client requests",
  "service requests",
  "browse requests",
  "my requests",
  "request status",
  "service orders",
  "manage requests",
];

export const metadata: Metadata = {
  title: {
    default: "Requests",
    template: "%s | Waraqati",
  },
  description:
    "View and manage your service requests on Waraqati. Track the status of each request and explore details about your requests easily.",
  keywords,
  openGraph: {
    title: "Requests | Waraqati",
    description:
      "Track and manage your service requests on Waraqati. Check the status and details of all your requests in one place.",
  },
};

const RequestsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default RequestsLayout;