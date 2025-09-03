"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingELementProps } from "@/types/components";

const LoadingElement = forwardRef<HTMLDivElement, LoadingELementProps>(
  ({ containerClasses = "", loaderClasses = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-text",
          containerClasses && containerClasses
        )}
      >
        <Loader2
          className={cn(
            "text-main animate-spin",
            loaderClasses && loaderClasses
          )}
        />
      </div>
    );
  }
);

LoadingElement.displayName = "LoadingElement";

export default LoadingElement;
