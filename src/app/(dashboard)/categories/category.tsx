'use client'

import { useEffect, useState } from 'react'
import { useDeleteCategory, useGetCategoryImage } from '@/hooks/useCategory'
import { CategoryCardProps } from '@/types/components'
import Image from 'next/image'
import { useAppContext } from '@/contexts/AppProvider'
import { APIResponse } from '@/types/hooks'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { pushToast, showWarning } = useAppContext()
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const router = useRouter()

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: 'SUCCESS' })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: 'ERROR' })
  }

  const { data: imageData, isLoading: imageLoading } = useGetCategoryImage(category.id)
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
    router.push(`/categories/edit/${id}`)
  }

  useEffect(() => {
    if (imageData && imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData)
      setImgUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageData])

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

      <div className="w-full h-40 bg-border flex items-center justify-center overflow-hidden">
        {imageLoading ? (
          <div className="bg-border w-full h-full flex items-center justify-center animate-pulse">
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-text-muted animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="mt-2 text-xs text-text-muted">Loading...</span>
            </div>
          </div>
        ) : imgUrl ? (
          <Image
            width={10}
            height={10}
            src={imgUrl}
            alt={category.title}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="text-text-muted text-sm italic">No image available</div>
        )}
      </div>

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
