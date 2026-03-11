import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/(dashboard)/layout";
import { Metadata } from "next";

const keywords = [
  ...(mainMetadata.keywords || []),
  "services",
  "browse services",
  "service marketplace",
  "request service",
  "find services",
  "search services",
  "service categories",
  "professional services",
];

export const metadata: Metadata = {
  title: {
    default: "Services",
    template: "%s | Waraqati",
  },
  description:
    "Browse and explore available services on Waraqati. Search, filter, and request professional services easily.",
  keywords,
  openGraph: {
    title: "Services | Waraqati",
    description:
      "Explore and request professional services on Waraqati. Search and filter services to find what you need.",
  },
};

const ServicesLayout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default ServicesLayout;