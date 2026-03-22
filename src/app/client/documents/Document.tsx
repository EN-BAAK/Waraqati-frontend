"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientDocumentRowProps } from "@/types/components"
import { useDeleteClientDocument } from "@/hooks/useClientDocument"
import { useAppContext } from "@/contexts/AppProvider"
import { APIResponse } from "@/types/hooks"
import { downloadClientDocument } from "@/api-client"

const DocumentRow: React.FC<ClientDocumentRowProps> = ({ document }) => {
  const { pushToast, showWarning } = useAppContext()

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: mutateAsyncDeleting, isPending } = useDeleteClientDocument({ onSuccess, onError })

  const handleDelete = async () => {
    showWarning({
      message: "Are you sure you want to delete this document?",
      btn1: "Cancel",
      btn2: "Delete",
      handleBtn2: () => mutateAsyncDeleting(document.id)
    })
  };

  const handleDownload = async () => {
    await downloadClientDocument(document.id)
  }

  return (
    <Card className="flex items-center justify-between p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <span className="text-text">{document.label}</span>
      </CardContent>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={isPending}
          onClick={handleDownload}
        >
          <Download size={16} />
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className={cn("cursor-pointer", isPending && "opacity-50 cursor-not-allowed")}
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  )
}

export default DocumentRow