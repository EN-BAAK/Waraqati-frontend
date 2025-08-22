import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { InputFieldProps } from "@/types/forms";

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type,
  styles,
  labelStyle,
  placeholder,
  dir,
  innerDivStyle,
  inputMode,
  Icon,
  iconStyle,
  autoComplete = "on",
  disabled = false,
}) => {
  return (
    <div className={`mb-4 ${styles || ""}`}>
      <div className={innerDivStyle}>
        {label && (
          <label
            htmlFor={name}
            className={`block mb-2 font-medium text-gray-700 ${labelStyle || ""}`}
          >
            {Icon && <span className={`inline-flex items-center mr-2 ${iconStyle}`}>{Icon}</span>}
            {label}:
          </label>
        )}

        <Field
          id={name}
          type={type}
          name={name}
          inputMode={inputMode}
          placeholder={placeholder}
          dir={dir}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full rounded-lg border border-gray-300 p-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default InputField;
