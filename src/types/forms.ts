export type Input = "text" | "color" | "number" | "password" | "email";
export type Dir = "auto" | "ltr" | "rtl";
export type SelectOption = {
  key: string;
  value: string | number;
}

export type SubmitButtonProps = {
  isSubmitting: boolean
  isDirty: boolean
  isValid: boolean
  label?: string
  submittingLabel?: string
  disabledLabel?: string
  className?: string
  onClick?: () => void
}

export interface BaseFieldProps {
  name: string;
  label?: string;
  styles?: string;
  labelStyle?: string;
  innerDivStyle?: string;
  Icon?: React.ReactNode;
  iconStyle?: string;
}

export interface InputFieldProps extends BaseFieldProps {
  type: Input;
  inputMode?: "numeric";
  placeholder?: string;
  dir?: Dir;
  autoComplete?: "on" | "off";
  disabled?: boolean;
}

export interface TextAreaFieldProps extends BaseFieldProps {
  placeholder?: string;
  dir?: Dir;
}

export interface SelectorFieldProps extends BaseFieldProps {
  options: SelectOption[];
  inputClasses?: string;
}

export interface FileInputFieldProps extends BaseFieldProps {
  accept?: string;
}

export type TextErrorProps = {
  msg: string;
};

export type LoginProps = {
  email: string,
  password: string
}

export type ResetForgotPasswordEmailProps = {
  email: string
}

export type ResetForgotPasswordProps = {
  code: string,
  password: string
}