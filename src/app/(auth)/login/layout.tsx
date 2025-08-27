import type { Metadata } from "next"
import { CommonParentProps } from "@/types/global"
import React from "react"
import { metadata as mainMetadata } from "@/app/layout"

const keywords = [...(mainMetadata.keywords || []), "login", "sing in", "account"]

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Waraqati account to manage your paperwork efficiently.",
  keywords,
  openGraph: {
    title: "Login | Waraqati",
    description: "Securely log in to Waraqati to access and manage your paperwork.",
    url: "/login",
    type: "website",
  },
}

const Layout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>
}

export default Layout;
