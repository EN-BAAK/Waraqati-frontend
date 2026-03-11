import React from "react";
import { Metadata } from "next";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { metadata as mainMetadata } from "@/app/layout"
import { CommonParentProps } from "@/types/global";

const keywords = [...(mainMetadata.keywords || []), "dashboard", "control panel", "management", "app"]

export const metadata: Metadata = {
  title: {
    default: "Client Dashboard",
    template: "%s | Waraqati"
  },
  description: "Dashboard for managing requests, documents, and other personal features",
  keywords,
  openGraph: {
    title: "Dashboard | Waraqati",
    description: "Dashboard for managing requests, documents, and other personal features",
  },
};

const DashboardLayout: React.FC<CommonParentProps> = ({ children }) => {
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

export default DashboardLayout;
