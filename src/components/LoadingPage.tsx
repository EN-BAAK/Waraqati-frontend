"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingPage: React.FC = () => {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-center text-text"
      )}
    >
      <Loader2 className="h-12 w-12 text-main animate-spin" />
    </div>
  );
};

export default LoadingPage;
