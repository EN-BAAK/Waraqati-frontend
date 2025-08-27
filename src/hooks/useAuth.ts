import { login, logout, validateAuthentication } from "@/api-client"
import { LoginProps } from "@/types/forms";
import { MutationFnType, MutationProps } from "@/types/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useValidateAuthentication = () => {
  return useQuery({
    queryKey: ["verify-authentication"],
    queryFn: validateAuthentication,
    gcTime: 0,
    retry: false
  });
};

export const useLogin = (
  { onSuccess, onError }: MutationProps<
    Awaited<MutationFnType>,
    Error,
    LoginProps
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["verify-authentication"], exact: true });
      onSuccess?.(data, variables, context)
    },
    onError
  })
}

export const useLogout = (
  { onSuccess, onError }: MutationProps<
    Awaited<MutationFnType>,
    Error
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["verify-authentication"], exact: true });
      onSuccess?.(data, variables, context)
    },
    onError
  })
}

