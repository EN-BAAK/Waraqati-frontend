"use client"

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
            className={`mb-2 flex align-center block font-medium text-gray-700 ${labelStyle || ""}`}
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
        />
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default InputField;
