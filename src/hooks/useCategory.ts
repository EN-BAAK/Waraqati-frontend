import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  getCategoryImageById,
} from "@/api-client"
import { MutationFnType, MutationProps } from "@/types/hooks"
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

export const useGetCategoryById = (id: number) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
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
      queryClient.setQueryData<Category[]>(["categories"], (oldData) => {
        if (!oldData) return [data.data]
        return [data.data, ...oldData]
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
      queryClient.setQueryData<Category[]>(["categories"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((cat) => (cat.id === data.data.id ? data.data : cat))
      })
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
