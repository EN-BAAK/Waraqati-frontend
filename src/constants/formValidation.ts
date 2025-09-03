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

export const employeeCreationValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .required("First name is required"),

  middleName: Yup.string()
    .max(50, "Middle name must be at most 50 characters")
    .nullable(),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
    .required("Phone is required"),

  identityNumber: Yup.string()
    .min(6, "Identity number must be at least 6 characters")
    .max(20, "Identity number must be at most 20 characters")
    .required("Identity number is required"),

  isAdmin: Yup.boolean().required(),
});

export const employeeEditionValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .nullable(),

  middleName: Yup.string()
    .max(50, "Middle name must be at most 50 characters")
    .nullable(),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .nullable(),

  email: Yup.string()
    .email("Invalid email address")
    .nullable(),

  phone: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
    .nullable(),

  identityNumber: Yup.string()
    .min(6, "Identity number must be at least 6 characters")
    .max(20, "Identity number must be at most 20 characters")
    .nullable(),

  isAdmin: Yup.boolean().nullable(),
});
