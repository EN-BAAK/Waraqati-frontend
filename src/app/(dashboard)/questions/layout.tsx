import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/(dashboard)/layout";
import { Metadata } from "next";

const keywords = [
  ...(mainMetadata.keywords || []),
  "questions",
  "surveys",
  "forms",
  "questionnaire",
  "management",
  "feedback",
];

export const metadata: Metadata = {
  title: {
    default: "Questions",
    template: "%s | Waraqati",
  },
  description:
    "Questions management page for creating, editing, and organizing questions in Waraqati surveys and forms.",
  keywords,
  openGraph: {
    title: "Questions | Waraqati",
    description:
      "Questions management page for creating, editing, and organizing questions in Waraqati surveys and forms.",
  },
};

const QuestionsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return <>{children}</>;
};

export default QuestionsLayout;
