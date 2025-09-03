import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/(dashboard)/layout";
import { Metadata } from "next";

const keywords = [...(mainMetadata.keywords || []), "employees", "staff", "team", "users", "management"];

export const metadata: Metadata = {
  title: {
    default: "Employees",
    template: "%s | Waraqati",
  },
  description:
    "Employees for managing employees, viewing user details, and handling staff-related tasks in Waraqati.",
  keywords,
  openGraph: {
    title: "Employees | Waraqati",
    description: "Employees for managing employees, viewing user details, and handling staff-related tasks in Waraqati.",
  },
};

const EmployeesLayout: React.FC<CommonParentProps> = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default EmployeesLayout;
