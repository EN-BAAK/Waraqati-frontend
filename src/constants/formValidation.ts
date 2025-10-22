import { QUESTION_TYPE, ServiceCreation, SEX } from "@/types/global";
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

export const clientCreationValidationSchema = Yup.object({
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

  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be at most 50 characters")
    .required("Country is required"),

  age: Yup.number()
    .min(0, "Age cannot be negative")
    .max(120, "Age seems invalid")
    .required("Age is required"),

  sex: Yup.mixed<SEX>()
    .oneOf(Object.values(SEX), "Select a valid sex")
    .required("Sex is required"),
});

export const clientEditionValidationSchema = Yup.object({
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

  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be at most 50 characters")
    .nullable(),

  age: Yup.number()
    .min(0, "Age cannot be negative")
    .max(120, "Age seems invalid")
    .nullable(),

  sex: Yup.mixed<SEX>()
    .oneOf(Object.values(SEX), "Select a valid sex")
    .nullable(),
});

const questionSchema = Yup.object({
  question: Yup.string()
    .min(2, "Question must be at least 2 characters")
    .max(200, "Question must be at most 200 characters")
    .required("Question is required"),

  type: Yup.mixed<QUESTION_TYPE>()
    .oneOf(Object.values(QUESTION_TYPE), "Select a valid type")
    .required("Type is required"),

  choices: Yup.array()
    .of(
      Yup.string()
        .min(1, "Choice must not be empty")
        .max(100, "Choice must be at most 100 characters")
    )
    .when("type", {
      is: QUESTION_TYPE.MultiChoice,
      then: (schema) =>
        schema.min(2, "At least 2 choices are required for MultiChoice"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const requiredDocSchema = Yup.object({
  label: Yup.string()
    .min(1, "Document label must not be empty")
    .max(100, "Document label must be at most 100 characters")
    .required("Document label is required"),

  state: Yup.mixed<"new" | "exists">()
    .oneOf(["new", "exists"], "State must be 'new' or 'exists'")
    .required("Document state is required"),
});

export const serviceCreationValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .required("Title is required"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters")
    .required("Description is required"),

  duration: Yup.string()
    .min(1, "Duration is required")
    .max(50, "Duration must be at most 50 characters")
    .required("Duration is required"),

  price: Yup.number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price seems invalid")
    .required("Price is required"),

  categoryId: Yup.number().nullable(),

  questions: Yup.array().of(questionSchema).optional(),

  requiredDocs: Yup.array().of(requiredDocSchema).optional(),
});

export const serviceEditValidationSchema = Yup.object().shape({
  title: Yup.string().optional(),
  description: Yup.string().optional(),
  duration: Yup.string().optional(),
  price: Yup.number().min(0).optional(),
  categoryId: Yup.number().nullable(),

  questions: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required("Question text is required"),
      type: Yup.mixed<QUESTION_TYPE>()
        .oneOf(Object.values(QUESTION_TYPE))
        .required(),

      choices: Yup.mixed().when("type", {
        is: QUESTION_TYPE.MultiChoice,
        then: () =>
          Yup.array()
            .of(Yup.string().required("Choice cannot be empty"))
            .min(1, "Add at least one choice"),
        otherwise: () => Yup.array().notRequired(),
      }),
    })
  ),

  requiredDocs: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required("Label is required"),
      state: Yup.mixed<"new" | "exists" | "deleted">()
        .oneOf(["new", "exists", "deleted"])
        .optional(),
    })
  ),
});

export const categoryValidationSchema = Yup.object({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters")
    .required("Title is required"),

  desc: Yup.string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be at most 500 characters")
    .required("Description is required"),
});

export const categoryEditValidationSchema = Yup.object({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),

  desc: Yup.string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be at most 500 characters"),
});

export const questionValidationSchema = Yup.object({
  question: Yup.string().required("Question is required"),
  answer: Yup.string().required("Answer is required"),
  isActive: Yup.boolean(),
  categoryId: Yup.number().nullable(),
});

export const questionEditValidationSchema = Yup.object({
  question: Yup.string()
    .min(2, "Question must be at least 2 characters")
    .max(500, "Question must be at most 500 characters"),

  answer: Yup.string()
    .min(1, "Answer must be at least 1 character")
    .max(1000, "Answer must be at most 1000 characters"),

  isActive: Yup.boolean(),

  categoryId: Yup.number().nullable(),
});
