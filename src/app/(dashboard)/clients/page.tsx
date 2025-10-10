"use client";

import React, { useEffect, useRef } from "react";
import { useAppContext } from "@/contexts/AppProvider";
import { useDeleteClientById, useGetAllClients, useUpdateClientSpecialization } from "@/hooks/useClient";
import { APIResponse } from "@/types/hooks";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Client, SEX } from "@/types/global";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Star, StarOff, Trash2 } from "lucide-react";
import { handlePhoneCall } from "@/misc/helpers";
import { Input } from "@/components/ui/input";
import LoadingElement from "@/components/LoadingElement";
import { useDebouncedSearch } from "@/hooks/useHelpers";

const ClientsPage: React.FC = () => {
  const { search, setSearch, debouncedSearch } = useDebouncedSearch()
  const { data, fetchNextPage, hasNextPage, isFetching } = useGetAllClients(10, debouncedSearch);
  const { showWarning, pushToast } = useAppContext()

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const onUpdateSpecializationSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onUpdateSpecializationError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useDeleteClientById({ onSuccess: onDeleteSuccess, onError: onDeleteError })
  const { mutateAsync: updateSpecializationMutateAsync, isPending: isUpdateSpecializationPending } = useUpdateClientSpecialization({ onSuccess: onUpdateSpecializationSuccess, onError: onUpdateSpecializationError })

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

  const handleUpdateSpecialization = async (id: number, isSpecial: boolean) => {
    const reversedSpecialization = !isSpecial
    updateSpecializationMutateAsync({ userId: id, isSpecial: reversedSpecialization })
  }

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
        <h1 className="font-semibold text-2xl text-text">Clients</h1>
        <Input
          placeholder="Search clients..."
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
                msg="There are no clients yet"
                action={
                  <Button
                    className="bg-main hover:bg-main-hover transition duration-300 text-face cursor-pointer"
                    onClick={handleAddClient}
                  >
                    Add Client
                  </Button>
                }
              />
              : <div className="h-full overflow-y-auto  min-w-[800px]" ref={containerRef}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>Creditor</TableHead>
                      <TableHead>Debit</TableHead>
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
                                ? client.isSpecial
                                  ? "bg-yellow-200 hover:bg-yellow-300"
                                  : "hover:bg-gray-100"
                                : client.isSpecial
                                  ? "bg-yellow-200/50 text-gray-700 hover:bg-yellow-300/60"
                                  : "bg-gray-300 hover:bg-gray-200"
                            )}
                          >
                            <TableCell className="text-sm">
                              <div className="flex items-center justify-center gap-1">
                                {client.isSpecial ? (
                                  <Star
                                    onClick={() => handleUpdateSpecialization(client.id, client.isSpecial)}
                                    size={16}
                                    className="text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors"
                                  />
                                ) : (
                                  <StarOff
                                    onClick={() => handleUpdateSpecialization(client.id, client.isSpecial)}
                                    size={16}
                                    className="text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors"
                                  />
                                )}
                                {client.id}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="font-medium text-text">
                                {client.firstName} {client.lastName}
                              </div>
                              <div className="text-xs text-text-muted">
                                {client.email}
                              </div>
                            </TableCell>

                            <TableCell
                              onClick={() => handlePhoneCall(client.phone)}
                              className="text-text hover:text-main transition duration-300 cursor-pointer">
                              {client.phone}
                            </TableCell>
                            <TableCell>{client.country}</TableCell>
                            <TableCell>{client.age}</TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "px-3 py-1 rounded-full font-medium text-xs",
                                  client.sex === SEX.Male
                                    ? "bg-main/10 text-main"
                                    : client.sex === SEX.Female
                                      ? "bg-red-200 text-red-500"
                                      : "bg-green-100 text-green-500"
                                )}
                              >
                                {client.sex}
                              </span>
                            </TableCell>
                            <TableCell className="font-semibold text-green-600">+{client.creditor}</TableCell>
                            <TableCell className="font-semibold text-red-600">-{client.debit}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  className="bg-transparent shadow-none text-orange-500 hover:bg-orange-400 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isDeletePending || isUpdateSpecializationPending}
                                  onClick={() => handleEditClient(client.id)}
                                >
                                  <Pencil />
                                </Button>

                                <Button
                                  className="bg-transparent shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isDeletePending || isUpdateSpecializationPending}
                                  onClick={() => handleDelete(client.id)}
                                >
                                  <Trash2 />
                                </Button>

                                <Button
                                  className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isDeletePending || isUpdateSpecializationPending}
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
        }
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
