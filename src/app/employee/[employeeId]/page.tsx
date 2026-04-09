"use client";

import React from "react";
import Hero from "./Hero";
import Account from "./Account";
import TopService from "./TopService";
import LatestServices from "./LatestServices";
import { useParams, useRouter } from "next/navigation";
import { useGetEmployeeById } from "@/hooks/useEmployee";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { useGetLatestServiceByEmployee, useGetTopServiceByEmployee } from "@/hooks/useService";

const EmployeeProfilePage: React.FC = () => {
  const { employeeId } = useParams();
  const router = useRouter()

  const employeeIdNum = Number(employeeId);

  const { data: employeeData, isFetching: isEmployeeLoading, isError: isEmployeeError } = useGetEmployeeById(employeeIdNum);
  const { data: topServiceData, isFetching: isTopServiceLoading } = useGetTopServiceByEmployee(employeeIdNum)
  const { data: latestServiceData, isFetching: isLatestServiceLoading } = useGetLatestServiceByEmployee(employeeIdNum)

  const employee = employeeData?.data
  const topService = topServiceData?.data
  const latestServices = latestServiceData?.data || []

  const handleGoBack = () => router.back()

  if (!employee || isEmployeeError) return <EmptyElement
    msg='There is no employee'
    action={<Button className="bg-main hover:bg-main-hover text-face transition duration-300 cursor-pointer" onClick={handleGoBack}>Go back</Button>} />

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <Hero employee={employee} isLoading={isEmployeeLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Account employee={employee} isLoading={isEmployeeLoading} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {topService && <TopService service={topService} isLoading={isTopServiceLoading} />}
            <LatestServices services={latestServices} isLoading={isLatestServiceLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfilePage