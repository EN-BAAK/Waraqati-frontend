"use client";

import { useDeleteEmployeeById, useGetAllEmployees } from "@/hooks/useEmployee";
import { Employee } from "@/types/global";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/LoadingPage";
import { Eye, Pencil, Trash2 } from "lucide-react";
import LoadingElement from "@/components/LoadingElement";
import EmptyElement from "@/components/EmptyElement";
import { useAppContext } from "@/contexts/AppProvider";
import { APIResponse } from "@/types/hooks";
import { handlePhoneCall } from "@/misc/helpers";
import { useDebouncedSearch } from "@/hooks/useHelpers";
import { Input } from "@/components/ui/input";

const EmployeesPage: React.FC = () => {
  const { search, setSearch, debouncedSearch } = useDebouncedSearch()
  const { data, fetchNextPage, hasNextPage, isFetching, } = useGetAllEmployees(20, debouncedSearch);
  const { showWarning, pushToast } = useAppContext()

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useDeleteEmployeeById({ onSuccess: onDeleteSuccess, onError: onDeleteError })

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleAddEmployee = () => router.push("/employees/add");
  const handleEditClient = (id: number) => router.push(`/employees/edit/${id}`);
  const handleExploreEmployee = (id: number) => router.push(`/employees/${id}`)

  const handleDelete = async (id: number) => {
    showWarning({
      message: "Are you sure you want to delete this employee?",
      btn1: "Cancel",
      btn2: "Delete",
      handleBtn2: () => deleteMutateAsync(id)
    })
  };

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
                          <TableRow
                            key={`${pageIndex}-${employee.id}`}
                            className={cn(
                              "transition duration-300",
                              employee.isVerified
                                ? "hover:bg-gray-100"
                                : "bg-gray-300 hover:bg-gray-100"
                            )}
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

                            <TableCell
                              onClick={() => handlePhoneCall(employee.phone)}
                              className="text-text hover:text-main transition duration-300 cursor-pointer">
                              {employee.phone}
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

                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  className="bg-transparent shadow-none text-orange-500 hover:bg-orange-400 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
                                  disabled={isDeletePending}
                                  onClick={() => handleEditClient(employee.id)}
                                >
                                  <Pencil />
                                </Button>

                                <Button
                                  className="bg-transparent shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
                                  disabled={isDeletePending}
                                  onClick={() => handleDelete(employee.id)}
                                >
                                  <Trash2 />
                                </Button>

                                <Button
                                  className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
                                  disabled={isDeletePending}
                                  onClick={() => handleExploreEmployee(employee.id)}
                                >
                                  <Eye />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
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
