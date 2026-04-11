import { changePassword, forgetPasswordSendEmail, getUserProfile, getUserProfileImage, resetForgottenPassword } from "@/api-client"
import { ResetForgotPasswordEmailProps, ResetForgotPasswordProps } from "@/types/forms"
import { ResetPassword } from "@/types/global"
import { MutationFnType, MutationProps } from "@/types/hooks"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useForgetPasswordSendEmail = ({ onSuccess, onError }: MutationProps<Awaited<MutationFnType>, Error, ResetForgotPasswordEmailProps>) => {
  return useMutation({
    mutationFn: forgetPasswordSendEmail,
    onSuccess,
    onError
  })
}

export const useResetForgottenPassword = ({ onSuccess, onError }: MutationProps<Awaited<MutationFnType>, Error, ResetForgotPasswordProps>) => {
  return useMutation({
    mutationFn: resetForgottenPassword,
    onSuccess,
    onError
  })
}

export const useChangePassword = ({ onSuccess, onError }: MutationProps<Awaited<MutationFnType>, Error, Omit<ResetPassword, "confirmPassword">>) => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess,
    onError
  })
}

export const useGetUserProfileImage = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user-profile-image", id],
    queryFn: () => getUserProfileImage(id),
    retry: false,
    enabled
  })
}

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    retry: false,
  })
}