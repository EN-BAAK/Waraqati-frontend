import { login, validateAuthentication } from "@/api-client"
import { MutationProps } from "@/types/hooks"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useLogin = ({ onSuccess, onError }: MutationProps) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError
  })
}

export const useValidateAuthentication = () => {
  return useQuery({
    queryKey: ["verify-authentication"],
    queryFn: validateAuthentication,
    gcTime: 0,
  });
};