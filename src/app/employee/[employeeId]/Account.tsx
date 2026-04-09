import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EmployeeProfileAccountProps } from '@/types/components';
import { Activity, CircleCheck, CircleX, IdCard, Phone, Shield, ShieldCheck, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function InfoRow({ icon, label, children, }: { icon: React.ReactNode; label: string; children: React.ReactNode; }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#e5e7eb] last:border-0">
      <div className="flex items-center gap-2.5 text-[#6b7280]">
        <span className="shrink-0">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

const Account: React.FC<EmployeeProfileAccountProps> = ({ employee, isLoading = true }) => {
  if (isLoading)
    return <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-5 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>

  return (
    <Card className="border border-[#e5e7eb] shadow-none rounded-xl bg-[#ffffff]">
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-sm font-semibold text-[#111827] flex items-center gap-2">
          <User size={15} className="text-[#2563eb]" />
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <InfoRow icon={<ShieldCheck size={15} />} label="Verified">
          {employee.isVerified ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <CircleCheck size={11} /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              <CircleX size={11} /> Unverified
            </span>
          )}
        </InfoRow>

        <InfoRow icon={<Shield size={15} />} label="Role">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border",
              employee.isAdmin
                ? "text-[#9333ea] bg-[#faf5ff] border-[#e9d5ff]"
                : "text-[#6b7280] bg-[#f9fafb] border-[#e5e7eb]"
            )}
          >
            {employee.isAdmin ? <Shield size={11} /> : <User size={11} />}
            {employee.isAdmin ? "Administrator" : "Employee"}
          </span>
        </InfoRow>

        <InfoRow icon={<Activity size={15} />} label="Status">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border",
              employee.isAvailable
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-red-600 bg-red-50 border-red-200"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                employee.isAvailable ? "bg-green-500 animate-pulse" : "bg-red-400"
              )}
            />
            {employee.isAvailable ? "Available" : "Unavailable"}
          </span>
        </InfoRow>

        <InfoRow icon={<Phone size={15} />} label="Phone">
          <span className="text-sm text-[#111827] font-medium tabular-nums">{employee.phone}</span>
        </InfoRow>

        <InfoRow icon={<IdCard size={15} />} label="Identity Number">
          <span className="text-sm text-[#111827] font-mono font-medium">{employee.identityNumber}</span>
        </InfoRow>
      </CardContent>
    </Card>
  );
}

export default Account