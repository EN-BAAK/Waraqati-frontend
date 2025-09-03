"use client";

import React, { useEffect, useRef } from "react";
import { useAppContext } from "@/contexts/AppProvider";
import { useDeleteClientById, useGetAllClients } from "@/hooks/useClient";
import { APIResponse } from "@/types/hooks";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Client } from "@/types/global";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import LoadingElement from "@/components/LoadingElement";

const ClientsPage: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, } = useGetAllClients(20);
  const { showWarning, pushToast } = useAppContext()

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useDeleteClientById({ onSuccess: onDeleteSuccess, onError: onDeleteError })

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleAddClient = () => router.push("/clients/add");
  const handleEditClient = (id: number) => router.push(`/clients/edit/${id}`);
  const handleExploreClient = (id: number) => router.push(`/clients/${id}`)

  const handleDelete = async (id: number) => {
    showWarning({
      message: "Are you sure you want to delete this client?",
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

  if (isFetching) {
    return (
      <LoadingPage />
    );
  }

  if (!data?.pages || !data?.pages[0].data.items || !data?.pages[0].data.items.length)
    return <EmptyElement
      msg="There is no Clients yet"
      action={<Button
        className="bg-main hover:bg-main-hover transition duration-300 text-face cursor-pointer"
        onClick={handleAddClient}
      >
        Add Client
      </Button>}
    />

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-hidden">
      <h1 className="mb-4 font-semibold text-2xl text-text">Employees</h1>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] border border-border rounded-lg overflow-x-auto overflow-hidden">
        <div className="h-full overflow-y-auto  min-w-[800px]" ref={containerRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Creditor</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Special</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.pages.map(
                (page, pageIndex) =>
                  page?.data?.items?.length > 0 &&
                  page.data.items.map((client: Client) => (
                    <TableRow
                      key={`${pageIndex}-${client.id}`}
                      className={cn(
                        "transition duration-300",
                        client.isVerified
                          ? "hover:bg-gray-100"
                          : "bg-gray-300 hover:bg-gray-100"
                      )}
                    >
                      <TableCell className="text-center text-sm">{client.id}</TableCell>

                      <TableCell>
                        <div className="font-medium text-text">
                          {client.firstName} {client.lastName}
                        </div>
                        {client.middleName && (
                          <div className="text-xs text-text-muted">{client.middleName}</div>
                        )}
                      </TableCell>

                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.country}</TableCell>
                      <TableCell>{client.age}</TableCell>
                      <TableCell>{client.sex}</TableCell>
                      <TableCell className="font-semibold text-green-600">+{client.creditor}</TableCell>
                      <TableCell className="font-semibold text-red-600">-{client.debit}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full font-medium text-xs",
                            client.isSpecial
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-border text-text-muted"
                          )}
                        >
                          {client.isSpecial ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full font-medium text-xs",
                            client.isVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {client.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            className="bg-transparent shadow-none text-orange-500 hover:bg-orange-400 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDeletePending}
                            onClick={() => handleEditClient(client.id)}
                          >
                            <Pencil />
                          </Button>

                          <Button
                            className="bg-transparent shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDeletePending}
                            onClick={() => handleDelete(client.id)}
                          >
                            <Trash2 />
                          </Button>

                          <Button
                            className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDeletePending}
                            onClick={() => handleExploreClient(client.id)}
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
      </div>

      <Button
        onClick={handleAddClient}
        className="bg-main hover:bg-main-hover py-1 px-4 rounded absolute bottom-5 right-5 transition duration-300 cursor-pointer"
      >
        Add
      </Button>
    </div>
  );
};

export default ClientsPage;
