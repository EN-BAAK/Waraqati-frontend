import { forgetPasswordSendEmail, getUserProfileImage, resetForgottenPassword } from "@/api-client"
import { ResetForgotPasswordEmailProps, ResetForgotPasswordProps } from "@/types/forms"
import { MutationFnType, MutationProps } from "@/types/hooks"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useForgetPasswordSendEmail = (
  { onSuccess, onError }: MutationProps<
    Awaited<MutationFnType>,
    Error,
    ResetForgotPasswordEmailProps
  >
) => {
  return useMutation({
    mutationFn: forgetPasswordSendEmail,
    onSuccess,
    onError
  })
}

export const useResetForgottenPassword = (
  { onSuccess, onError }: MutationProps<
    Awaited<MutationFnType>,
    Error,
    ResetForgotPasswordProps
  >
) => {
  return useMutation({
    mutationFn: resetForgottenPassword,
    onSuccess,
    onError
  })
}

export const useGetUserProfile = (id: number) => {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => getUserProfileImage(id),
    retry: false
  })
}