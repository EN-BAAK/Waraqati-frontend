export type Input = "text" | "color" | "number" | "password" | "email";
export type Dir = "auto" | "ltr" | "rtl";
export type SelectOption = {
  key: string;
  value: string | number;
}

export interface BaseFieldProps {
  readonly name: string;
  readonly label?: string;
  readonly styles?: string;
  readonly labelStyle?: string;
  readonly innerDivStyle?: string;
  readonly Icon?: React.ReactNode;
  readonly iconStyle?: string;
}

export interface InputFieldProps extends BaseFieldProps {
  readonly type: Input;
  readonly inputMode?: "numeric";
  readonly placeholder?: string;
  readonly dir?: Dir;
  readonly autoComplete?: "on" | "off";
  readonly disabled?: boolean;
}

export interface TextAreaFieldProps extends BaseFieldProps {
  readonly placeholder?: string;
  readonly dir?: Dir;
}

export interface SelectorFieldProps extends BaseFieldProps {
  readonly options: SelectOption[];
  readonly inputClasses?: string;
}

export interface FileInputFieldProps extends BaseFieldProps {
  readonly accept?: string;
}

export type TextErrorProps = {
  readonly msg: string;
};
