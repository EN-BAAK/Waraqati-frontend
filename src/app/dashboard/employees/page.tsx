"use client";

import { useGetAllEmployees } from "@/hooks/useEmployee";
import { Employee } from "@/types/global";
import React, { useEffect, useRef } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/LoadingPage";
import LoadingElement from "@/components/LoadingElement";
import EmptyElement from "@/components/EmptyElement";
import { useDebouncedSearch } from "@/hooks/useHelpers";
import { Input } from "@/components/ui/input";
import EmployeeRow from "./Employee";
import { useRouter } from "next/navigation";

const EmployeesPage: React.FC = () => {
  const { search, setSearch, debouncedSearch } = useDebouncedSearch()
  const { data, fetchNextPage, hasNextPage, isFetching, } = useGetAllEmployees(20, debouncedSearch);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleAddEmployee = () => router.push("employees/add");

  useEffect(() => {
    if (!loadMoreRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {

        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      {
        root: containerRef.current,
        rootMargin: "250px",
        threshold: 0,
      }
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-hidden">
      <div className="mb-2 flex justify-between items-center">
        <h1 className="font-semibold text-2xl text-text">Employees</h1>
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-[300px] w-[45%]"
        />
      </div>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] border border-border rounded-lg overflow-x-auto overflow-hidden">
        {
          isFetching
            ? <LoadingPage />
            : ((!data?.pages || !data.pages[0].data.items || !data.pages[0].data.items.length))
              ? <EmptyElement
                msg="There are no employees yet"
                action={
                  <Button
                    className="bg-main hover:bg-main-hover transition duration-300 text-face cursor-pointer"
                    onClick={handleAddEmployee}
                  >
                    Add Employee
                  </Button>
                }
              />
              : <div className="h-full overflow-y-auto  min-w-[800px]" ref={containerRef}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Creditor</TableHead>
                      <TableHead>Debit</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.pages.map(
                      (page, pageIndex) =>
                        page?.data?.items?.length > 0 &&
                        page.data.items.map((employee: Employee) => (
                          <EmployeeRow key={`employee-${pageIndex}-${employee.id}`} employee={employee} />
                        ))
                    )}
                  </TableBody>
                </Table>

                {hasNextPage && <LoadingElement ref={loadMoreRef} containerClasses="w-full py-2" loaderClasses="w-5 h-5" />}
              </div>
        }
      </div>

      <Button
        onClick={handleAddEmployee}
        className="bg-main hover:bg-main-hover py-1 px-4 rounded absolute bottom-5 right-5 transition duration-300 cursor-pointer"
      >
        Add
      </Button>
    </div>
  );
};

export default EmployeesPage;
