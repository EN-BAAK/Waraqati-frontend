import RatingStars from '@/components/RatingStars';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { EmployeeProfileHeroProps } from '@/types/components';
import { Mail, Shield } from 'lucide-react';
import React from 'react'

const Hero: React.FC<EmployeeProfileHeroProps> = ({ employee, isLoading = true }) => {
  if (isLoading)
    return (
      <div className="rounded-2xl overflow-hidden bg-[#f9fafb] border border-[#e5e7eb] p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
          <div className="flex-1 w-full space-y-3 text-center sm:text-left">
            <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
            <Skeleton className="h-5 w-24 mx-auto sm:mx-0" />
          </div>
        </div>
      </div>
    );

  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #9333ea 100%)",
          opacity: 0.96,
        }}
      />
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8">
        <UserAvatar id={employee.id} firstName={employee.firstName} lastName={employee.lastName} width={110} height={110} />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
            {employee.isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full mx-auto sm:mx-0">
                <Shield size={11} /> Admin
              </span>
            )}
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-white/80 text-sm">
            <Mail size={14} />
            <span>{employee.email}</span>
          </div>

          <div className="pt-1 flex items-center justify-center sm:justify-start">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-flex items-center gap-2">
              <RatingStars avg={2} count={3} isFetching={isLoading} />
            </div>
          </div>
        </div>

        <div className="sm:self-start">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border",
              employee.isAvailable
                ? "bg-green-500/20 text-green-100 border-green-400/40"
                : "bg-red-500/20 text-red-100 border-red-400/40"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                employee.isAvailable ? "bg-green-300 animate-pulse" : "bg-red-300"
              )}
            />
            {employee.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Hero