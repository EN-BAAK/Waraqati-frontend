"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetEmployeeById } from '@/hooks/useEmployee';
import { Mail, Shield, CreditCard, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import EmptyElement from '@/components/EmptyElement';
import { Button } from '@/components/ui/button';
import LoadingPage from '@/components/LoadingPage';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const router = useRouter()
  const { data: employee, isLoading, error } = useGetEmployeeById(Number(userId));

  const handleGoBack = () => router.back()

  if (isLoading)
    return <LoadingPage />

  if (error || !employee?.data)
    return <EmptyElement
      msg='There is no employee'
      action={<Button className="bg-main hover:bg-main-hover text-face transition duration-300 cursor-pointer" onClick={handleGoBack}>Go back</Button>} />

  const employeeData = employee.data;
  const netBalance = employeeData.creditor - employeeData.debit;

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-main via-main to-second p-8 rounded-3xl relative text-white overflow-hidden">
          <div className="bg-face/5 w-32 h-32 rounded-full absolute top-0 right-0 -translate-y-16 translate-x-16" />
          <div className="bg-white/5 w-24 h-24 absolute bottom-0 left-0 rounded-full translate-y-12 -translate-x-12" />

          <div className="flex items-start space-x-8 relative">
            <div className="flex-shrink-0">
              <div className="bg-face/10 w-24 h-24 flex items-center justify-center rounded-2xl scale-[1.1] backdrop-blur-sm">
                <UserAvatar
                  firstName={employeeData.firstName}
                  lastName={employeeData.lastName}
                  id={employeeData.id}
                  width={80}
                  height={80}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="mb-2 font-bold text-3xl">
                {employeeData.firstName} {employee.middleName} {employeeData.lastName}
              </h1>

              <div className="mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-face/80" />
                <span className="text-lg text-face/90">{employeeData.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-face border border-border rounded-2xl overflow-hidden">
          <div className="bg-back px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-text flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-main" />
              Financial Overview
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 mb-3 rounded-full inline-flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-wide font-medium text-sm text-text-muted">Total Credit</p>
                  <p className="font-bold text-3xl text-green-600">+{employeeData.creditor}</p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 mb-3 rounded-full inline-flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-wide font-medium text-sm text-text-muted">Total Debit</p>
                  <p className="font-bold text-3xl text-red-600">-{employeeData.debit}</p>
                </div>
              </div>

              <div className="text-center">
                <div className={cn(
                  "w-12 h-12 mb-3 rounded-full inline-flex items-center justify-center",
                  netBalance >= 0 ? "bg-blue-100" : "bg-orange-100"
                )}>
                  <DollarSign className={cn(
                    "w-6 h-6",
                    netBalance >= 0 ? "text-blue-600" : "text-orange-600"
                  )} />
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-wide font-medium text-sm text-text-muted">Net Balance</p>
                  <p className={cn(
                    "font-bold text-3xl",
                    netBalance >= 0 ? "text-blue-600" : "text-orange-600"
                  )}>
                    {netBalance >= 0 ? '+' : ''}{netBalance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-face border border-border rounded-2xl overflow-hidden">
          <div className="bg-back px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-text flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-main" />
              Account Status
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="py-3 flex items-center justify-between border-b border-border/50">
                <span className="font-medium text-text-muted">Account Verification</span>
                <div className="flex items-center space-x-2">
                  {employeeData.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={cn(
                    "font-semibold",
                    employeeData.isVerified ? "text-green-600" : "text-red-600"
                  )}>
                    {employeeData.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between border-b border-border/50">
                <span className="font-medium text-text-muted">Current Availability</span>
                <div className="flex items-center space-x-2">
                  {employeeData.isAvailable ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={cn(
                    "font-semibold",
                    employeeData.isAvailable ? "text-green-600" : "text-red-600"
                  )}>
                    {employeeData.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="font-medium text-text-muted">Administrative Privileges</span>
                <div className="flex items-center space-x-2">
                  <Shield className={cn(
                    "w-5 h-5",
                    employeeData.isAdmin ? "text-yellow-600" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-semibold",
                    employeeData.isAdmin ? "text-yellow-600" : "text-gray-600"
                  )}>
                    {employeeData.isAdmin ? "Administrator" : "Standard User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;