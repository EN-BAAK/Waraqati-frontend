import type { Metadata } from "next"
import { metadata as mainMetadata } from "@/app/layout"
import { CommonParentProps } from "@/types/global"
import React from "react"

const keywords = [...(mainMetadata.keywords || []), "recover", "forgot password", "recover account", "account", "reset password", "password"]

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your Waraqati account securely by resetting your password.",
  keywords,
  openGraph: {
    title: "Forgot Password | Waraqati",
    description: "Enter your email to receive a verification code and reset your password.",
    url: "/forgot-password",
    type: "website",
  },
}

const Layout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>
}

export default Layout; 