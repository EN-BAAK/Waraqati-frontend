import { TextErrorProps } from "@/types/forms";
import React from "react";

const TextError: React.FC<TextErrorProps> = ({ msg }) => {
  return (
    <div className="text-red-500 font-medium text-sm mt-1">
      {msg}
    </div>
  );
};

export default TextError;
