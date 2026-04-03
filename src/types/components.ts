import React from "react";
import { CategoricQuestions, Category, Client, ClientDocument, Employee, GlobalClientRequest, GlobalEmployeeRequest, GlobalService, RequiredDoc, Variant } from "./global";

export type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type ToastProps = {
  onClose: () => void;
} & ToastMessage;

export type Warning = {
  message: string;
  btn1?: string;
  btn2: string;
  styleBtn1?: Variant;
  styleBtn2?: Variant;
  handleBtn2: () => void;
};

export type WarningProps = {
  onClose: () => void
} & Warning

export type UserAvatarProps = {
  id: number
  firstName: string,
  lastName: string,
  width?: number,
  height?: number,
}

export type LoadingELementProps = {
  loaderClasses?: string,
  containerClasses?: string
}

export type EmptyElementProps = {
  msg?: string,
  action?: React.ReactNode
}

export type CategoryCardProps = {
  category: Category
}

export type CategoryCardImageProps = {
  id: number,
  title: string
}

export type CategoricalQuestionsComponentProps = {
  category: CategoricQuestions
}

export type ServiceRowProps = {
  service: GlobalService,
}

export type ClientServiceCardProps = {
  service: GlobalService,
}

export type ClientRowProps = {
  client: Client
}

export type EmployeeRowProps = {
  employee: Employee
}

export type DocumentCardProps = {
  doc: RequiredDoc
}

export type ClientRequestCardProps = {
  request: GlobalClientRequest
}

export type ClientDocumentRowProps = {
  document: ClientDocument
}

export type RequestRowProps = {
  request: GlobalEmployeeRequest
}

export type TasksFilterProps = {
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  search: string,
  setCategory: React.Dispatch<React.SetStateAction<string>>,
  setState: React.Dispatch<React.SetStateAction<string>>,
}