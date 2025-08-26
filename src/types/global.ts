export type CommonParentProps = {
  readonly children: React.ReactNode
}

export type Variant = "default" | "secondary" | "destructive" | "outline";

export enum ROLE {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER"
}

export type User = {
  id?: number,
  firstName: string,
  middleName?: string,
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