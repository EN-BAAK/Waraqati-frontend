import * as Yup from "yup"

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

export const resetForgotPasswordEmailValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
})

export const resetForgotPasswordValidationSchema = Yup.object({
  code: Yup.string()
    .length(6, "Code must be 6 characters")
    .required("Verification code is required"),
  password: Yup.string()
    .min(6, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .required("New password is required"),
})