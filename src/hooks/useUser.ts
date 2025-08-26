import { forgetPasswordSendEmail, resetForgottenPassword } from "@/api-client"
import { MutationProps } from "@/types/hooks"
import { useMutation } from "@tanstack/react-query"

export const useForgetPasswordSendEmail = ({ onSuccess, onError }: MutationProps) => {
  return useMutation({
    mutationFn: forgetPasswordSendEmail,
    onSuccess,
    onError
  })
}

export const useResetForgottenPassword = ({ onSuccess, onError }: MutationProps) => {
  return useMutation({
    mutationFn: resetForgottenPassword,
    onSuccess,
    onError
  })
}