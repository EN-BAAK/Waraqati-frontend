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

export type User = {
  id?: number,
  firstName: string,
  middleName?: string,
  lastName: string,
  email: string,
  phone: string,
  identifyNumber: string,
  role: string
}

export type APIResponse<T> = {
  message: string,
  success: boolean,
  data: T
}