"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientRequestStarRatingProps } from "@/types/components";
import { useGetClientRate, useRateRequest } from "@/hooks/useRequestRate";
import { APIResponse } from "@/types/hooks";
import { useAppContext } from "@/contexts/AppProvider";

const StarRating: React.FC<ClientRequestStarRatingProps> = ({ requestId }) => {
  const { data, isFetching } = useGetClientRate(requestId);
  const { pushToast } = useAppContext();

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutate, isPending } = useRateRequest({ onSuccess, onError });

  const [hovered, setHovered] = useState<number | null>(null);

  const currentRate = data?.data ?? 0;

  const handleClick = (rate: number) => {
    mutate({ requestId, rate });
  };

  const displayRate = hovered ?? currentRate;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRate;

        return (
          <Star
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleClick(star)}
            className={cn(
              "w-4 h-4 cursor-pointer transition-all",
              isFilled
                ? "fill-orange text-orange"
                : "text-border",
              (isPending || isFetching) && "opacity-50 cursor-not-allowed"
            )}
          />
        );
      })}
    </div>
  );
};

export default StarRating;