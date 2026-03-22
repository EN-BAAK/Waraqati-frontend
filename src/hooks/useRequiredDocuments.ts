import { createRequiredDocument, deleteRequiredDocuments, getAllRequiredDocuments, getRequiredDocumentsById, updateRequiredDocument } from "@/api-client"
import { RequiredDoc, RequiredDocCreation, updateItemWithType } from "@/types/global"
import { APIResponse, MutationFnType, MutationProps } from "@/types/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAllRequiredDocuments = () => {
  return useQuery({
    queryKey: ["required-documents"],
    queryFn: getAllRequiredDocuments,
    retry: false,
  })
}

export const useGetRequiredDocumentById = (id: number) => {
  return useQuery({
    queryKey: ["required-document", id],
    queryFn: () => getRequiredDocumentsById(id),
    retry: false,
  })
}

export const useCreateRequiredDocument = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, RequiredDocCreation>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRequiredDocument,
    onSuccess: (data, variables, context) => {
      const newDoc = data.data

      queryClient.setQueryData<APIResponse<RequiredDoc[]>>(["required-documents"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: [newDoc, ...oldData.data],
        }
      })

      onSuccess?.(data, variables, context)
    },
    onError,
  })
}

export const useUpdateRequiredDoc = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, updateItemWithType<RequiredDocCreation>>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRequiredDocument,
    onSuccess: (data, variables, context) => {
      const updatedDoc = data.data
      const docId = updatedDoc.id

      queryClient.setQueryData<APIResponse<RequiredDoc[]>>(["required-documents"], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.map((cat) =>
            cat.id === docId ? updatedDoc : cat
          ),
        }
      })

      onSuccess?.(data, variables, context)
    },
    onError,
  })
}

export const useDeleteRequiredDocument = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRequiredDocuments,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<APIResponse<RequiredDoc[]>>(["required-documents"], (oldData) => {
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