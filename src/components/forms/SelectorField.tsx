import React from "react";
import { Field, ErrorMessage, type FieldProps } from "formik";
import TextError from "./TextError";
import { SelectorFieldProps } from "@/types/forms";

const SelectorField: React.FC<SelectorFieldProps> = ({
  name,
  options,
  label,
  styles,
  labelStyle,
  innerDivStyle,
  inputClasses = "",
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

        <Field name={name}>
          {({ field }: FieldProps) => (
            <select
              id={name}
              {...field}
              className={`w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${inputClasses}`}
            >
              <option value="">Select</option>
              {options.map((option) => (
                <option key={`${name}-${option.value}`} value={option.value}>
                  {option.key}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default SelectorField;
