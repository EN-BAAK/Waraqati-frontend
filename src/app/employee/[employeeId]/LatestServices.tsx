import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBalance } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { EmployeeProfileLatestServices } from '@/types/components';
import { GlobalService } from '@/types/global';
import { Briefcase, ChevronRight, Clock, Inbox } from 'lucide-react'
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

function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}


function ServiceCard({ service }: { service: GlobalService }) {
  return (
    <Card className="border border-[#e5e7eb] shadow-none rounded-xl bg-[#ffffff] hover:border-[#2563eb]/40 hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-[#111827] leading-snug group-hover:text-[#2563eb] transition-colors line-clamp-1">
            {service.title}
          </h3>

          {service.category && <span className={cn("shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full", categoryBadge(service.category))}>
            {service.category}
          </span>}

        </div>
        <p className="text-xs text-[#6b7280] leading-relaxed mb-4 line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#111827]">{formatBalance(service.price)}</span>
            <span className="text-[#e5e7eb]">·</span>
            <span className="flex items-center gap-1 text-xs text-[#6b7280]">
              <Clock size={11} /> {service.duration}d
            </span>
          </div>
          <ChevronRight size={14} className="text-[#e5e7eb] group-hover:text-[#2563eb] transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyServices() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="h-14 w-14 rounded-2xl bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center mb-4">
        <Inbox size={22} className="text-[#6b7280]" />
      </div>
      <h3 className="text-sm font-semibold text-[#111827] mb-1">No services yet</h3>
      <p className="text-xs text-[#6b7280] max-w-xs">
        This employee hasn&apos;t added any services. Services will appear here once created.
      </p>
    </div>
  );
}

const LatestServices: React.FC<EmployeeProfileLatestServices> = ({ services, isLoading }) => {
  if (isLoading)
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
    </div>

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Briefcase size={15} className="text-[#2563eb]" />
        <h2 className="text-sm font-semibold text-[#111827]">Latest Services</h2>
        {services.length > 0 && (
          <span className="text-xs font-medium bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] px-2 py-0.5 rounded-full">
            {services.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.length === 0 ? (
          <EmptyServices />
        ) : (
          services.slice(0, 5).map((svc) => <ServiceCard key={svc.id} service={svc} />)
        )}
      </div>
    </div>
  )
}

export default LatestServices