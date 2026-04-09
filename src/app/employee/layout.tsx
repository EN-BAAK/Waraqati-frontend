import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/dashboard/layout";
import { Metadata } from "next";
import Sidebar from "../Sidebar";
import Header from "../Header";

const keywords = [...(mainMetadata.keywords || []), "employees", "staff", "team", "users", "management"];

export const metadata: Metadata = {
  title: {
    default: "Employees",
    template: "%s | Waraqati",
  },
  keywords,
  openGraph: {
    title: "Employees | Waraqati",
  },
};

const EmployeesLayout: React.FC<CommonParentProps> = ({ children }) => {
  return (
    <div className="bg-back min-h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="bg-back max-h-[calc(100vh-56px)] p-3 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EmployeesLayout;
