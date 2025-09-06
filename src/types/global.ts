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

export type PaginationQueryProps = {
  limit: number,
  page: number
}

export type updateItemWithFormData = {
  id: number,
  data: FormData
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
