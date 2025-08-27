import React from "react";
import { Metadata } from "next";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { metadata as mainMetadata } from "@/app/layout"

const keywords = [...(mainMetadata.keywords || []), "dashboard", "control panel", "management", "app"]

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Waraqati",
    template: "%s | Waraqati"
  },
  description: "Dashboard for managing users, tasks, and other app features",
  keywords,
  openGraph: {
    title: "Dashboard | Waraqati",
    description: "Dashboard for managing users, tasks, and other app features",
  },
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-back min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="bg-back p-3 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
