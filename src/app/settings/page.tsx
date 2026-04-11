"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetUserProfile } from "@/hooks/useUser";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const { data, isFetching, isError } = useGetUserProfile();

  const user = data?.data;

  const handleGoBack = () => router.back();

  if ((!user || isError) && !isFetching)
    return (
      <EmptyElement
        msg="There is no user data"
        action={
          <Button
            className="bg-main hover:bg-main-hover text-face transition duration-300"
            onClick={handleGoBack}
          >
            Go back
          </Button>
        }
      />
    );

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-hidden">
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-heading text-text">Settings</h1>
          <p className="text-text-muted text-sm">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => router.push("/settings/reset-password")}
          >
            <CardContent className="p-5 space-y-2">
              <h2 className="text-lg font-semibold text-text">Security</h2>
              <p className="text-sm text-text-muted">
                Change your password and manage security settings
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;