'use client'

import { useGetAllCategories } from "@/hooks/useCategory"
import CategoryCard from "./category"
import { Category } from "@/types/global"
import EmptyElement from "@/components/EmptyElement"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import LoadingPage from "@/components/LoadingPage"

const CategoriesPage: React.FC = () => {
  const { data, isLoading } = useGetAllCategories()

  const router = useRouter();

  const handleAddCategory = () => router.push("/categories/add");

  if (isLoading)
    return <LoadingPage />

  if (!data?.data || !data.data.length)
    return <EmptyElement
      msg="There is no categories yet"
      action={<Button
        className="bg-main hover:bg-main-hover transition duration-300 text-face cursor-pointer"
        onClick={handleAddCategory}
      >
        Add Category
      </Button>}
    />

  return (
    <div className="bg-face h-full p-6 rounded-2xl shadow-sm overflow-auto">
      <h1 className="mb-4 font-semibold text-2xl text-text">Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.data.map((category: Category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      <Button
        onClick={handleAddCategory}
        className="bg-main hover:bg-main-hover py-1 px-4 rounded absolute bottom-5 right-5 transition duration-300 cursor-pointer"
      >
        Add
      </Button>
    </div >
  )
}

export default CategoriesPage