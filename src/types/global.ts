import { IconType } from "react-icons";
import { QueryKey } from "./hooks";

export type CommonParentProps = {
  readonly children: React.ReactNode
}

export type CachedUser = { data: User; timestamp: number } | null

export type Variant = "default" | "secondary" | "destructive" | "outline" | "main";

export enum ROLE {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  GUEST = "GUEST"
}

export enum DocumentType {
  IMAGE = "image/*",
  PDF = ".pdf",
  EXCEL = ".xls,.xlsx,.csv",
  WORD = ".doc,.docx",
  TEXT = ".txt",
  ZIP = ".zip,.rar",
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

export enum Update_Offset_Unit_Process {
  UP = "UP",
  DOWN = "DOWN"
}

export enum REQUESTS_STATE {
  IN_PROGRESS = "in progress",
  CANCELED = "canceled",
  IN_QUEUE = "in queue",
  IN_HOLD = "in hold",
  REVIEWED = "reviewed",
  FINISHED = "finished",
  SUCCEED = "succeed",
}

export type OffsetUnit = {
  [K in QueryKey]?: QueryKey | OffsetUnit
}

export type PaginationQueryProps = {
  limit: number,
  page: number
}

export type PaginationSearchedQueryProps = {
  limit: number,
  page: number,
  offsetUnit?: number
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
  category: string
}

export type requestPaginationFilterQueryProps = {
  limit: number,
  page: number,
  search?: string,
  category?: string,
  state?: string
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

export type ResetPassword = {
  password: string,
  newPassword: string,
  confirmPassword: string
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
  price: number,
  category?: string
}

export type DetailedService = {
  questions: ServiceQuestion[]
  requiredDocs: RequiredDoc[],
} & GlobalService

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

export type RequiredDocCreation = Omit<RequiredDoc, "id">

export type Service = {
  categoryId?: number
} & Omit<DetailedService, "category">

export type ServiceCreation = {
  categoryId: number,
  questions: Omit<ServiceQuestion, "id">[];
  requiredDocs: (Omit<RequiredDoc, "label"> & { state: "new" | "exists" | "deleted" })[];
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

export interface AccessItem {
  authorized: boolean;
  path: string;
  roles: ROLE[];
  children?: AccessItem[];
}

export type GlobalQuestion = {
  id: number,
  question: string,
  answer: string,
  order: number,
  isActive: boolean
}

export type CategoricQuestions = {
  category?: string,
  questions: GlobalQuestion[]
}

export type GlobalQuestionCreation = {
  categoryId?: number
} & Omit<GlobalQuestion, "id" | "order">

export type Question = {
  category?: string
} & Omit<GlobalQuestion, "isActive" | "order">

export type RequestCreation = {
  questions: {
    questionId: number
    answer: string
  }[]
  documents: {
    documentId: number
    file: File
  }[]
}

export type GlobalClientRequest = {
  id: number,
  service: string,
  employee?: {
    id: number,
    name: string,
  },
  category?: string,
  state: REQUESTS_STATE,
  createdAt: Date
}

export type GlobalEmployeeRequest = {
  id: number,
  service: string,
  client: {
    id: number,
    name: string,
    phone: string
  },
  category?: string,
  state: REQUESTS_STATE,
  createdAt: Date
}

export type GlobalManagerRequest = {
  employee: {
    id: number,
    name: string,
    phone: string
  },
} & GlobalEmployeeRequest

export type ClientDocument = {
  id: number,
  label: string
}