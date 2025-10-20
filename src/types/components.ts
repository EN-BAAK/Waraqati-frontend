import { CategoricQuestions, Category, Variant } from "./global";

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

export type CategoricalQuestionsComponentProps = {
  category: CategoricQuestions
}