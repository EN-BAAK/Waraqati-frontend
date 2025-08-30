"use client";

import { SelectImageFieldProps } from "@/types/forms";
import Image from "next/image";
import React, { useRef } from "react";
import { FiX, FiUpload } from "react-icons/fi";

const SelectImageField: React.FC<SelectImageFieldProps> = ({
  value,
  setValue,
  label,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(file);
    }
  };

  const handleRemove = () => {
    setValue(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="font-medium text-sm text-gray-700">{label}</span>}

      {!value ? (
        <label
          className="p-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-main rounded-lg transition duration-300 cursor-pointer"
        >
          <FiUpload className="w-6 h-12 mb-0 text-gray-500" />
          <span className="text-sm text-gray-500">Click to select image</span>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative w-full h-32">
          <Image
            src={URL.createObjectURL(value)}
            alt="Selected preview"
            className="w-full h-full object-contain rounded-lg shadow"
            width={500}
            height={500}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-500 hover:bg-red-600 p-1 rounded-full absolute top-1 right-1 text-white transition duration-300 cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectImageField;
