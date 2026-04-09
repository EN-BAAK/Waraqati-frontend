import { RatingStarsProps } from "@/types/components";
import React from "react";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const RatingStars: React.FC<RatingStarsProps> = ({ count, avg, isFetching, }) => {
  const totalStars = 5;

  if (isFetching) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalStars }).map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-sm" />
          ))}
        </div>

        <Skeleton className="w-16 h-4 rounded-md" />
      </div>
    );
  }

  const renderStar = (index: number) => {
    const fillPercentage = Math.min(Math.max(avg - index, 0), 1);

    return (
      <div key={index} className="relative">
        <Star size={15} className="text-border" />

        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${fillPercentage * 100}%` }}
        >
          <Star size={15} className="text-orange fill-orange" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: totalStars }, (_, i) => renderStar(i))}
      </div>

      <div className="text-sm">
        {avg.toFixed(1)} ({count})
      </div>
    </div>
  );
};

export default RatingStars;