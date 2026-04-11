import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/dashboard/layout";
import { Metadata } from "next";
import Sidebar from "../Sidebar";
import Header from "../Header";

const keywords = [
  ...(mainMetadata.keywords || []),
  "settings",
  "user settings",
  "profile",
  "account",
  "preferences",
  "password",
  "theme",
  "language",
];

export const metadata: Metadata = {
  title: {
    default: "Settings",
    template: "%s | Waraqati",
  },
  keywords,
  openGraph: {
    title: "Settings | Waraqati",
  },
};

const SettingsLayout: React.FC<CommonParentProps> = ({ children }) => {
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

export default SettingsLayout;