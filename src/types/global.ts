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

export type PaginationQueryProps = {
  limit: number,
  page: number
}

export type updateItemWithFormData = {
  id: number,
  data: FormData
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