import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/(dashboard)/layout";
import { Metadata } from "next";

const keywords = [
  ...(mainMetadata.keywords || []),
  "categories",
  "services categories",
  "classification",
  "management",
  "organization",
];

export const metadata: Metadata = {
  title: {
    default: "Categories",
    template: "%s | Waraqati",
  },
  description:
    "Categories for organizing and managing different types of services in Waraqati.",
  keywords,
  openGraph: {
    title: "Categories | Waraqati",
    description:
      "Categories for organizing and managing different types of services in Waraqati.",
  },
};

const CategoriesLayout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default CategoriesLayout;
