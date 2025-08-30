"use client"

import React from "react";
import { Field, ErrorMessage, type FieldProps } from "formik";
import TextError from "./TextError";
import { CheckBoxFieldProps } from "@/types/forms";

const CheckboxField: React.FC<CheckBoxFieldProps> = ({
  name,
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
      <div className={`flex items-center gap-2 ${innerDivStyle || ""}`}>
        <Field name={name}>
          {({ field }: FieldProps) => (
            < input
              id={name}
              type="checkbox"
              {...field}
              checked={field.value}
              className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 ${inputClasses}`}
            />
          )}
        </Field>

        {label && (
          <label
            htmlFor={name}
            className={`flex items-center text-gray-700 font-medium cursor-pointer ${labelStyle || ""}`}
          >
            {Icon && (
              <span className={`inline-flex items-center mr-2 ${iconStyle}`}>
                {Icon}
              </span>
            )}
            {label}
          </label>
        )}
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default CheckboxField;
