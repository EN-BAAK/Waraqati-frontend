import React from "react"
import { CommonParentProps } from "@/types/global"
import { metadata as mainMetadata } from "@/app/dashboard/layout"
import { Metadata } from "next"

const keywords = [
  ...(mainMetadata.keywords || []),
  "documents",
  "user documents",
  "upload documents",
  "manage documents",
  "my documents",
  "document status",
  "document management",
]

export const metadata: Metadata = {
  title: {
    default: "Documents",
    template: "%s | Waraqati",
  },
  description:
    "View, upload, and manage your personal documents on Waraqati. Keep track of document status and easily access your files.",
  keywords,
  openGraph: {
    title: "Documents | Waraqati",
    description:
      "Manage your documents on Waraqati. Upload new documents, check existing ones, and track document status conveniently.",
  },
}

const DocumentsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>
}

export default DocumentsLayout