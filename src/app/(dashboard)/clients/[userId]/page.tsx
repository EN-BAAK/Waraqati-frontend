"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetClientById } from "@/hooks/useClient";
import {
  Mail,
  Globe,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/LoadingPage";

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const router = useRouter();
  const { data: client, isLoading, error } = useGetClientById(Number(userId));

  const handleGoBack = () => router.back();

  if (isLoading) return <LoadingPage />;

  if (error || !client?.data)
    return (
      <EmptyElement
        msg="There is no client"
        action={
          <Button
            className="bg-main hover:bg-main-hover text-face transition duration-300 cursor-pointer"
            onClick={handleGoBack}
          >
            Go back
          </Button>
        }
      />
    );

  const clientData = client.data;
  const netBalance = clientData.creditor - clientData.debit;

  return (
    <div className="bg-face max-h-full p-2 sm:p-6 rounded-2xl shadow-sm overflow-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-main via-main to-second p-8 rounded-3xl relative text-white overflow-hidden">
          <div className="bg-face/5 w-32 h-32 rounded-full absolute top-0 right-0 -translate-y-16 translate-x-16" />
          <div className="bg-white/5 w-24 h-24 absolute bottom-0 left-0 rounded-full translate-y-12 -translate-x-12" />

          {clientData.isSpecial && (
            <div className="absolute top-4 right-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-yellow-400 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.425 8.2 1.193-5.934 5.787 1.402 8.171L12 18.897l-7.336 3.866 1.402-8.171L.132 9.205l8.2-1.193z" />
              </svg>
            </div>
          )}

          <div className="flex items-start space-x-8 relative">
            <div className="flex-shrink-0">
              <div className="bg-face/10 w-24 h-24 flex items-center justify-center rounded-2xl scale-[1.1] backdrop-blur-sm">
                <UserAvatar
                  firstName={clientData.firstName}
                  lastName={clientData.lastName}
                  id={clientData.id}
                  width={80}
                  height={80}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="mb-2 font-bold text-3xl">
                {clientData.firstName} {clientData.middleName} {clientData.lastName}
              </h1>

              <div className="mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-face/80" />
                <span className="text-lg text-face/90">{clientData.email}</span>
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
                <div className="bg-green-100 w-12 h-12 mb-3 inline-flex items-center justify-center rounded-full">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-wide font-medium text-sm text-text-muted">
                    Total Credit
                  </p>
                  <p className="font-bold text-3xl text-green-600">
                    +{clientData.creditor}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 mb-3 inline-flex items-center justify-center rounded-full">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-wide font-medium text-sm text-text-muted">
                    Total Debit
                  </p>
                  <p className="font-bold text-3xl text-red-600">
                    -{clientData.debit}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div
                  className={cn(
                    "w-12 h-12 mb-3 inline-flex items-center justify-center rounded-full",
                    netBalance >= 0 ? "bg-blue-100" : "bg-orange-100"
                  )}
                >
                  <DollarSign
                    className={cn(
                      "w-6 h-6",
                      netBalance >= 0 ? "text-blue-600" : "text-orange-600"
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-wide font-medium text-sm text-text-muted">
                    Net Balance
                  </p>
                  <p
                    className={cn(
                      "font-bold text-3xl",
                      netBalance >= 0 ? "text-blue-600" : "text-orange-600"
                    )}
                  >
                    {netBalance >= 0 ? "+" : ""}
                    {netBalance}
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
              Client Details
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="py-3 flex items-center justify-between border-b border-border/50">
              <span className="font-medium text-text-muted">Account Verification</span>
              <div className="flex items-center space-x-2">
                {clientData.isVerified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={cn(
                    "font-semibold",
                    clientData.isVerified ? "text-green-600" : "text-red-600"
                  )}
                >
                  {clientData.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between border-b border-border/50">
              <span className="font-medium text-text-muted">Country</span>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-main" />
                <span className="font-semibold">{clientData.country}</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between border-b border-border/50">
              <span className="font-medium text-text-muted">Age</span>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-main" />
                <span className="font-semibold">{clientData.age}</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="font-medium text-text-muted">Sex</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{clientData.sex}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
