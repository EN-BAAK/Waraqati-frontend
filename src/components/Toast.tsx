"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastProps } from "@/types/components";

const Toast: React.FC<ToastProps & { index: number; onClose: () => void }> = ({
  message,
  type,
  onClose,
  index,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "SUCCESS";

  return (
    <div
      className={cn(
        "w-80 p-4 rounded-2xl shadow-lg absolute z-50 transition-all duration-300 ease-in-out animate-in slide-in-from-left-5",
        isSuccess ? "bg-green-600" : "bg-red-600"
      )}
      style={{
        top: `${index * 90 + 16}px`,
        left: "1rem",
      }}
    >
      <button
        onClick={onClose}
        className="hover:bg-black/20 p-1 rounded-full text-white absolute top-2 right-2 transition cursor-pointer"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <h1 className="mb-1 font-semibold text-white">
        {isSuccess ? "Success" : "Error"}
      </h1>

      <p className="text-sm text-white">{message}</p>
    </div>
  );
};

export default Toast;
