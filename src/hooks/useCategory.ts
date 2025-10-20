import {
  getAllCategories,
  createCategory,
  updateCategory,
  getCategoryImageById,
  deleteCategory,
  getClientById,
  getAllCategoriesIdentifies,
} from "@/api-client"
import { APIResponse, MutationFnType, MutationProps } from "@/types/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { updateItemWithFormData } from "@/types/global"
import { Category } from "@/types/global"

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    retry: false,
  })
}

export const useGetAllCategoriesIdentities = () => {
  return useQuery({
    queryKey: ["categories-identities"],
    queryFn: getAllCategoriesIdentifies,
    retry: false,
  })
}

export const useGetCategoryById = (id: number) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getClientById(id),
    refetchOnMount: "always",
    retry: false,
  })
}

export const useCreateCategory = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, FormData>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data, variables, context) => {
      const newCategory = data.data

      queryClient.setQueryData<APIResponse<Category[]>>(["categories"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: [newCategory, ...oldData.data],
        }
      })

      queryClient.setQueryData<APIResponse<Omit<Category, "desc">[]>>(["categories-identities"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: [{ id: newCategory.id, title: newCategory.title }, ...oldData.data],
        }
      })

      onSuccess?.(data, variables, context)
    },
    onError,
  })
}

export const useUpdateCategory = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, updateItemWithFormData>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data, variables, context) => {
      const updatedCategory = data.data
      const categoryId = updatedCategory.id

      queryClient.setQueryData<APIResponse<Category[]>>(["categories"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.map((cat) =>
            cat.id === categoryId ? updatedCategory : cat
          ),
        }
      })

      queryClient.setQueryData<APIResponse<Category[]>>(["categories-identities"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.map((cat) =>
            cat.id === categoryId ? { ...cat, title: updatedCategory.title } : cat
          ),
        }
      })

      const formData = variables.data
      const hasImageField = formData instanceof FormData && formData.has("image")

      if (hasImageField) {
        queryClient.invalidateQueries({ queryKey: ["category-image", categoryId] })
      }

      onSuccess?.(data, variables, context)
    },
    onError,
  })
}

export const useGetCategoryImage = (id: number) => {
  return useQuery({
    queryKey: ["category-image", id],
    queryFn: () => getCategoryImageById(id),
    enabled: !!id,
    retry: false,
  })
}

export const useDeleteCategory = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<APIResponse<Category[]>>(["categories"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.filter((cat) => cat.id !== variables),
        }
      })

      queryClient.setQueryData<APIResponse<Category[]>>(["categories-identities"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.filter((cat) => cat.id !== variables),
        }
      })

      onSuccess?.(data, variables, context)
    },
    onError,
  })
}
