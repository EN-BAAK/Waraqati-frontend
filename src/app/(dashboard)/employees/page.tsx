"use client";

import { useGetAllEmployees } from "@/hooks/useEmployee";
import { Employee } from "@/types/global";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const EmployeesPage: React.FC = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useGetAllEmployees(20);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleAddEmployee = () => router.push("/employees/add");

  useEffect(() => {
    if (!hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-lg font-medium">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="bg-face p-6 rounded-2xl shadow-sm">
      <h1 className="mb-4 font-semiboldF text-2xl text-text">Employees</h1>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Creditor</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages.map(
              (page, pageIndex) =>
                page?.data?.items?.length > 0 &&
                page.data.items.map((employee: Employee) => (
                  <TableRow
                    key={`${pageIndex}-${employee.id}`}
                    className="hover:bg-back/40"
                  >
                    <TableCell className="text-center text-sm">
                      {employee.id}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-text">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-xs text-text-muted">
                        {employee.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full font-medium text-xs",
                          employee.isAdmin
                            ? "bg-main/10 text-main"
                            : "bg-border text-text-muted"
                        )}
                      >
                        {employee.isAdmin ? "Admin" : "Employee"}
                      </span>
                    </TableCell>

                    <TableCell className="font-semibold text-green-600">
                      +{employee.creditor}
                    </TableCell>

                    <TableCell className="font-semibold text-red-600">
                      -{employee.debit}
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full font-medium text-xs",
                          employee.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {employee.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <Button
        onClick={handleAddEmployee}
        className="bg-main hover:bg-main-hover py-1 px-4 rounded absolute bottom-5 right-5 transition duration-300 cursor-pointer"
      >
        Add
      </Button>

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-4 text-sm text-text-muted"
        >
          Loading more...
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
