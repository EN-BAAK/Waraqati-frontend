import { LoginProps, ResetForgotPasswordEmailProps, ResetForgotPasswordProps } from "@/types/forms";
import { CategoryCreation, ClientCreation, EmployeeCreation, ServiceCreation, SEX } from "@/types/global";

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

export const initialClient: ClientCreation = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  identityNumber: "",
  country: "",
  age: 0,
  sex: SEX.Male,
};

export const initialService: ServiceCreation = {
  title: "",
  description: "",
  duration: "",
  price: 0,
  questions: [],
  requiredDocs: [],
}

export const initialCategory: CategoryCreation = {
  title: "",
  desc: "",
};