"use client"

import React from "react"
import LoadingPage from "@/components/LoadingPage"
import EmptyElement from "@/components/EmptyElement"
import { ClientDocument } from "@/types/global"
import { useGetAllClientDocuments } from "@/hooks/useClientDocument"
import DocumentRow from "./Document"

const ClientDocumentsPage: React.FC = () => {
  const { data, isFetching } = useGetAllClientDocuments()
  const documents = data?.data

  if (!documents || documents.length === 0)
    return <EmptyElement msg="You have no documents yet" />

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-hidden">
      <h1 className="mb-2 font-semibold text-2xl text-text">Uploaded Documents</h1>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-y-auto overflow-hidden">
        {
          isFetching ? <LoadingPage />
            : (!documents || !documents.length) ? <EmptyElement msg="There is no documents uploaded yet" />
              : <div className="flex flex-col gap-3">
                {documents.map((doc: ClientDocument) => (
                  <DocumentRow key={`uploaded-documents-${doc.id}`} document={doc} />
                ))}
              </div>
        }
      </div>
    </div>
  )
}

export default ClientDocumentsPage