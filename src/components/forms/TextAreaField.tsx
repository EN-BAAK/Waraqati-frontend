import React from "react";
import TextError from "./TextError";
import { Field, ErrorMessage } from "formik";
import { TextAreaFieldProps } from "@/types/forms";

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  label,
  styles,
  labelStyle,
  placeholder,
  dir,
  innerDivStyle,
  Icon,
  iconStyle,
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
          as="textarea"
          id={name}
          name={name}
          placeholder={placeholder}
          dir={dir}
          rows={4}
          className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default TextAreaField;
