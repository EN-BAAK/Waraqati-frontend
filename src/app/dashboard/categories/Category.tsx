'use client'

import { useDeleteCategory } from '@/hooks/useCategory'
import { CategoryCardProps } from '@/types/components'
import { useAppContext } from '@/contexts/AppProvider'
import { APIResponse } from '@/types/hooks'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CategoryImage from './CategoryImage'

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { pushToast, showWarning } = useAppContext()
  const router = useRouter()

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: 'SUCCESS' })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: 'ERROR' })
  }

  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } =
    useDeleteCategory({ onSuccess: onDeleteSuccess, onError: onDeleteError })

  const handleDelete = async (id: number) => {
    showWarning({
      message: 'Are you sure you want to delete this category?',
      btn1: 'Cancel',
      btn2: 'Delete',
      handleBtn2: () => deleteMutateAsync(id),
    })
  }

  const handleEdit = (id: number) => {
    router.push(`categories/edit/${id}`)
  }

  return (
    <div className="bg-face border border-border rounded-lg shadow-sm200 overflow-hidden">
      <div className="bg-main/10 px-3 py-1 flex justify-between items-center border-b border-border">
        <h4 className="font-heading text-sm font-semibold text-main truncate">
          {category.title}
        </h4>

        <div className="flex gap-2">
          <Button
            className="bg-transparent w-8 h-8 flex items-center justify-center shadow-none text-orange-500 hover:bg-orange-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletePending}
            onClick={() => handleEdit(category.id)}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            className="bg-transparent w-8 h-8 flex items-center justify-center shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletePending}
            onClick={() => handleDelete(category.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CategoryImage id={category.id} title={category.title} />

      <div className="p-4">
        <div className="mb-2">
          {category.desc && category.desc.trim() ? (
            <p className="leading-relaxed line-clamp-3 text-sm text-text-muted">
              {category.desc}
            </p>
          ) : (
            <p className="italic text-sm text-text-muted">No description available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
