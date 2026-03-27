import { deleteClientDocument, getAllClientDocuments } from "@/api-client"
import { ClientDocument } from "@/types/global"
import { APIResponse, MutationFnType, MutationProps } from "@/types/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAllClientDocuments = () => {
  return useQuery({
    queryKey: ["client-documents"],
    queryFn: getAllClientDocuments,
    retry: false,
    gcTime: 0,
    staleTime: 0
  })
}

export const useDeleteClientDocument = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteClientDocument,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<APIResponse<ClientDocument[]>>(["client-documents"], (oldData) => {
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