import { Skeleton } from '@/components/ui/skeleton';
import { formatBalance } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { EmployeeProfileTopService } from '@/types/components'
import { Clock, Sparkles, Tag, Wallet } from 'lucide-react'
import React from 'react'

const CATEGORY_COLORS: Record<string, string> = {
  Design: "bg-[#ede9fe] text-[#7c3aed]",
  Research: "bg-[#fef3c7] text-[#b45309]",
  Development: "bg-[#dbeafe] text-[#1d4ed8]",
  Marketing: "bg-[#dcfce7] text-[#15803d]",
  Default: "bg-[#f3f4f6] text-[#374151]",
};

function categoryBadge(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Default"];
}

const TopService: React.FC<EmployeeProfileTopService> = ({ service, isLoading = true }) => {
  if (isLoading)
    return <div className="rounded-xl border-2 border-[#e5e7eb] bg-[#ffffff] p-6 space-y-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>

  if (!service)
    return null;

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-[#2563eb]/30 bg-[#ffffff] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea]" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#eff6ff] flex items-center justify-center shrink-0">
              <Sparkles size={15} className="text-[#2563eb]" />
            </div>
            <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider">Top Service</span>
          </div>

          {service.category && <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", categoryBadge(service.category))}>
            <Tag size={10} className="inline mr-1" />
            {service.category}
          </span>}
        </div>

        <h2 className="text-xl font-bold text-[#111827] mb-2 leading-tight">{service.title}</h2>
        <p className="text-sm text-[#6b7280] leading-relaxed mb-5">{service.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#f0fdf4] text-green-700 border border-green-200 rounded-lg px-3 py-1.5">
            <Wallet size={13} />
            <span className="text-sm font-bold">{formatBalance(service.price)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] rounded-lg px-3 py-1.5">
            <Clock size={13} />
            <span className="text-sm font-semibold">{service.duration} days</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopService