"use client";

import { SelectDocumentFieldProps } from "@/types/forms";
import React, { useRef } from "react";
import { FiX, FiFile, FiImage } from "react-icons/fi";
import { FaFilePdf, FaFileExcel, FaFileWord } from "react-icons/fa";
import { BiFile } from "react-icons/bi";
import { DocumentType } from "@/types/global";

const SelectDocumentField: React.FC<SelectDocumentFieldProps> = ({
  value,
  setValue,
  label,
  className = "",
  acceptTypes,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const buildAcceptString = (types?: DocumentType[]) => {
    if (!types || types.length === 0) return undefined;
    return types.join(",");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(file);
    }
  };

  const handleRemove = () => {
    setValue(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  const getFileIcon = (ext: string) => {
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return <FiImage className="text-green-500 w-6 h-6" />;
    }

    if (ext === "pdf") {
      return <FaFilePdf className="text-red-500 w-6 h-6" />;
    }

    if (["xls", "xlsx", "csv"].includes(ext)) {
      return <FaFileExcel className="text-green-600 w-6 h-6" />;
    }

    if (["doc", "docx"].includes(ext)) {
      return <FaFileWord className="text-blue-600 w-6 h-6" />;
    }

    return <FiFile className="text-gray-500 w-6 h-6" />;
  };

  const fileName = value instanceof File ? value.name : null;
  const extension = fileName ? getFileExtension(fileName) : "";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="font-medium text-sm text-gray-700">
          {label}
        </span>
      )}

      {!fileName ? (
        <label className="px-4 flex items-center border-2 border-gray-300 hover:border-main rounded-lg transition duration-300 cursor-pointer">
          <BiFile className="w-6 h-12 text-gray-500" />

          <span className="text-sm text-gray-500">
            Click to select document
          </span>

          <input
            ref={inputRef}
            type="file"
            accept={buildAcceptString(acceptTypes)}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div
          dir="ltr"
          className="flex items-center justify-between gap-3 border rounded-lg p-3 bg-gray-50"
        >
          <div className="flex items-center gap-2">
            {getFileIcon(extension)}

            <span className="text-sm text-gray-700 truncate max-w-[200px]">
              {fileName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-500 p-1 rounded-full text-white transition duration-300 hover:bg-red-600 cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectDocumentField;