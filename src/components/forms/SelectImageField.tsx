"use client";

import { SelectImageFieldProps } from "@/types/forms";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { FiX, FiUpload } from "react-icons/fi";

const SelectImageField: React.FC<SelectImageFieldProps> = ({
  value,
  setValue,
  currentImage,
  label,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImageExists, setIsImageExists] = useState<boolean>(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(file);
      setIsImageExists(true);
    }
  };

  const handleRemove = () => {
    setValue(null);
    setIsImageExists(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (currentImage) {
      setIsImageExists(true);
    }
  }, [currentImage]);

  const previewImage =
    value instanceof File
      ? URL.createObjectURL(value)
      : value === null
        ? null
        : currentImage || null;

  const shouldShowImage = isImageExists && previewImage;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="font-medium text-sm text-gray-700">{label}</span>}

      {!shouldShowImage ? (
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
            src={previewImage}
            alt="Selected preview"
            className="w-full h-full object-contain rounded-lg shadow"
            width={500}
            height={500}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-500 p-1 rounded-full absolute top-1 right-1 text-white transition duration-300 cursor-pointer hover:bg-red-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectImageField;
