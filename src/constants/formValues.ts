import { LoginProps, ResetForgotPasswordEmailProps, ResetForgotPasswordProps } from "@/types/forms";
import { EmployeeCreation } from "@/types/global";

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

export const initialEmployee: EmployeeCreation = {
  firstName: "",
  middleName: "",
  email: "",
  lastName: "",
  identityNumber: "",
  isAdmin: false,
  phone: "",
}