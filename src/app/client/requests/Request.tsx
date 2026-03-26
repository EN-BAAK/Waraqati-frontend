"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ClientRequestCardProps } from "@/types/components";
import { cn } from "@/lib/utils";
import { requestStateStyle } from "@/lib/helpers";

const RequestCard: React.FC<ClientRequestCardProps> = ({ request }) => {
  return (
    <Card className="bg-face flex flex-col border border-border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex sm:items-center justify-between flex-wrap gap-2">
          <h3 className="font-heading font-semibold text-text text-lg line-clamp-2">
            {request.service || "Untitled Service"}
          </h3>

          <span
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-full uppercase flex items-center justify-center",
              requestStateStyle[request.state] || "bg-gray-100 text-gray-800"
            )}
          >
            {request.state}
          </span>
        </div>

        <span className="text-text-muted text-sm">
          {request.category || "Uncategorized"}
        </span>
      </CardHeader>

      <CardContent className="pt-2 px-4 flex flex-col gap-2 text-sm text-text-muted">
        {request.employee && <div className="flex justify-between">
          <span className="font-medium text-text">Employee:</span>
          <span>{request.employee.name}</span>
        </div>}

        <div className="flex justify-between items-center">
          <span className="font-medium text-text">Requested:</span>
          <span className="text-xs">{format(new Date(request.createdAt), "PPP p")}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;