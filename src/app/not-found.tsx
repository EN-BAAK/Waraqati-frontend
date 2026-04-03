"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import NotFoundImage from "@/assets/not-found.png"
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  return (
    <div className="bg-background p-6 min-h-screen flex items-center justify-center">
      <div className="text-center relative">

        <div className="border-2 border-danger/40 rounded-3xl absolute inset-0"></div>
        <div className="border-2 border-danger/20 rounded-3xl absolute -inset-2 blur-sm"></div>

        <span className="bg-danger/15 w-8 h-8 border border-danger/40 rounded-xl absolute -top-4 -left-4 rotate-12"></span>
        <span className="bg-danger/15 w-10 h-10 border border-danger/40 rounded-xl absolute -bottom-4 -right-4 -rotate-12"></span>

        <div className="bg-background/95 py-10 px-12 border border-muted rounded-3xl shadow-lg relative">
          <Image
            src={NotFoundImage}
            width={350}
            height={200}
            alt="not-found"
          />

          <p className="mb-6 font-sans text-lg text-muted-foreground">
            This page is not exists
          </p>

          <Button className="bg-main text-white hover:bg-main-hover cursor-pointer" variant="default" onClick={goBack}>Go back</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
