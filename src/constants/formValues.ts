import { LoginProps, ResetForgotPasswordEmailProps, ResetForgotPasswordProps } from "@/types/forms";

export const loginInItalValues: LoginProps = {
  email: "",
  password: "",
}

export const resetForgotPasswordEmailInitialValues: ResetForgotPasswordEmailProps = {
  email: ""
}

export const resetForgotPasswordInitialValues: ResetForgotPasswordProps = {
  code: "",
  password: ""
}