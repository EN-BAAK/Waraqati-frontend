import React from "react";
import { CommonParentProps } from "@/types/global";
import { metadata as mainMetadata } from "@/app/(dashboard)/layout";
import { Metadata } from "next";

const keywords = [...(mainMetadata.keywords || []), "clients", "customers", "accounts", "management", "contacts"];

export const metadata: Metadata = {
  title: {
    default: "Clients",
    template: "%s | Waraqati",
  },
  description:
    "Clients for managing customer accounts, viewing client details, and handling client-related tasks in Waraqati.",
  keywords,
  openGraph: {
    title: "Clients | Waraqati",
    description: "Clients for managing customer accounts, viewing client details, and handling client-related tasks in Waraqati.",
  },
};

const ClientsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default ClientsLayout;
