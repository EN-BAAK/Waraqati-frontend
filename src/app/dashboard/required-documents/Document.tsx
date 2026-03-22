'use client'

import { useAppContext } from '@/contexts/AppProvider'
import { APIResponse } from '@/types/hooks'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DocumentCardProps } from '@/types/components'
import { useDeleteRequiredDocument } from '@/hooks/useRequiredDocuments'

const DocumentCard: React.FC<DocumentCardProps> = ({ doc }) => {
  const { pushToast, showWarning } = useAppContext()
  const router = useRouter()

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: 'SUCCESS' })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: 'ERROR' })
  }

  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useDeleteRequiredDocument({ onSuccess: onDeleteSuccess, onError: onDeleteError, })

  const handleDelete = (id: number) => {
    showWarning({
      message: 'Are you sure you want to delete this document?',
      btn1: 'Cancel',
      btn2: 'Delete',
      handleBtn2: () => deleteMutateAsync(id),
    })
  }

  const handleEdit = (id: number) => {
    router.push(`required-documents/edit/${id}`)
  }

  return (
    <div className="bg-face border border-border rounded-lg shadow-sm200 overflow-hidden">
      <div className="bg-main/10 px-3 py-1 flex justify-between items-center border-b border-border">
        <h4 className="font-heading text-sm font-semibold text-main truncate">
          {doc.label}
        </h4>

        <div className="flex gap-2">
          <Button
            className="bg-transparent w-8 h-8 flex items-center justify-center shadow-none text-orange-500 hover:bg-orange-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletePending}
            onClick={() => handleEdit(doc.id)}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            className="bg-transparent w-8 h-8 flex items-center justify-center shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletePending}
            onClick={() => handleDelete(doc.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-text">
          {doc.label}
        </p>
      </div>
    </div>
  )
}

export default DocumentCard