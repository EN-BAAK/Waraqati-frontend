import { login, validateAuthentication } from "@/api-client"
import { MutationProps } from "@/types/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useValidateAuthentication = () => {
  return useQuery({
    queryKey: ["verify-authentication"],
    queryFn: validateAuthentication,
    gcTime: 0,
  });
};

export const useLogin = ({ onSuccess, onError }: MutationProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verify-authentication"], exact: true });
      onSuccess()
    },
    onError
  })
}