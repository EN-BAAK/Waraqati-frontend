"use client";

import React from "react";
import { format } from "date-fns";
import { ClientRequestCardProps } from "@/types/components";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { CalendarDays } from "lucide-react";
import { requestStateStyle, stateAccentLine } from "@/constants/global";

const RequestCard: React.FC<ClientRequestCardProps> = ({ request }) => {
  const state = request.state?.toLowerCase();

  return (
    <div className="group relative bg-face border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-[1px] hover:border-border/60">

      <div className={cn("absolute top-0 left-0 right-0 h-[3px]", stateAccentLine[state] ?? "bg-border")} />

      <div className="px-5 pt-5 pb-4 flex flex-col gap-4">

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text text-[15px] leading-snug line-clamp-2">
              {request.service || "Untitled Service"}
            </h3>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              {request.category || "Uncategorized"}
            </p>
          </div>

          <span
            className={cn(
              "shrink-0 mt-0.5 px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wide",
              requestStateStyle[state] ?? "bg-gray-100 text-gray-600"
            )}
          >
            {request.state}
          </span>
        </div>

        <div className="h-px bg-border/50" />

        <div className="flex items-center justify-between gap-3">

          {request.employee ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar
                firstName={request.employee.name}
                lastName={request.employee.name}
                id={request.employee.id}
                width={32}
                height={32}
              />
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted leading-none mb-0.5">Assigned to</p>
                <p className="text-xs font-medium text-text truncate">{request.employee.name}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-border/40 border border-border flex items-center justify-center shrink-0">
                <span className="text-text-muted text-xs">—</span>
              </div>
              <span className="text-xs text-text-muted">Unassigned</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <CalendarDays className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[11px] text-text-muted">
              {format(new Date(request.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RequestCard;