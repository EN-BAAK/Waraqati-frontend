import { useGetCategoryImage } from '@/hooks/useCategory'
import { useOnScreen } from '@/hooks/useHelpers'
import { CategoryCardImageProps } from '@/types/components'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const CategoryImage: React.FC<CategoryCardImageProps> = ({ id, title }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null)

  const { isVisible, ref } = useOnScreen();
  const { data: imageData, isLoading: imageLoading } = useGetCategoryImage(id, isVisible)

  useEffect(() => {
    if (imageData && imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData)
      setImgUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageData])

  return (
    <div ref={ref} className="w-full h-40 bg-border flex items-center justify-center overflow-hidden">
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
          alt={title}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="text-text-muted text-sm italic">No image available</div>
      )}
    </div>
  )
}

export default CategoryImage