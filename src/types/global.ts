import { IconType } from "react-icons";

export type CommonParentProps = {
  readonly children: React.ReactNode
}

export type Variant = "default" | "secondary" | "destructive" | "outline";

export enum ROLE {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  GUEST = "GUEST"
}

export enum SEX {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum QUESTION_TYPE {
  Number = "Number",
  Text = "Text",
  MultiChoice = "MultiChoice",
}

export type PaginationQueryProps = {
  limit: number,
  page: number
}

export type PaginationSearchedQueryProps = {
  limit: number,
  page: number,
  search?: string
}

export type updateItemWithFormData = {
  id: number,
  data: FormData
}

export type updateItemWithType<T> = {
  id: number,
  data: T
}

export type servicePaginationFilterQueryProps = {
  limit: number,
  page: number,
  title: string
}

export type User = {
  id: number,
  firstName: string,
  middleName?: string,
  lastName: string,
  email: string,
  phone: string,
  identityNumber: string,
  role: ROLE,
  isVerified: boolean
}

export type Employee = {
  rate: number,
  isAvailable: boolean,
  isAdmin: boolean,
  creditor: number,
  debit: number,
} & User

export type EmployeeCreation = Omit<Employee, "id" | "role" | "isVerified" | "isAvailable" | "debit" | "creditor" | "rate">

export type Client = {
  country: string,
  age: number,
  sex: SEX,
  creditor: number,
  debit: number,
  isSpecial: boolean
} & User

export type ClientCreation = Omit<Client, "id" | "role" | "isVerified" | "isSpecial" | "debit" | "creditor">

export type GlobalService = {
  id: number,
  title: string,
  description: string,
  duration: string,
  price: number
}

export type ServiceQuestion = {
  id: number,
  question: string,
  type: QUESTION_TYPE,
  choices?: string[]
}

export type RequiredDoc = {
  id: number,
  label: string
}

export type Service = {
  questions: ServiceQuestion[]
  requiredDocs: RequiredDoc[],
} & GlobalService

export type ServiceCreation = {
  questions: Omit<ServiceQuestion, "id">[];
  requiredDocs: (Omit<RequiredDoc, "id"> & { state: "new" | "exists" | "deleted" })[];
} & Omit<GlobalService, "id">;

export type Category = {
  id: number,
  title: string,
  desc: string,
}

export type CategoryCreation = {} & Omit<Category, "id">

export type SidebarLink = {
  label: string,
  href: string,
  Icon: IconType
}