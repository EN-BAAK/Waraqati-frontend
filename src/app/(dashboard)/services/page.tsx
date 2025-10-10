"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppProvider";
import { GlobalService } from "@/types/global";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import LoadingElement from "@/components/LoadingElement";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useDeleteServiceById, useGetAllServices } from "@/hooks/useService";
import { APIResponse } from "@/types/hooks";
import { useDebouncedSearch } from "@/hooks/useHelpers";
import { Input } from "@/components/ui/input";

const ServicesPage: React.FC = () => {
  const { search, setSearch, debouncedSearch } = useDebouncedSearch()
  const { data, fetchNextPage, hasNextPage, isFetching } = useGetAllServices(20, debouncedSearch);
  const { showWarning, pushToast } = useAppContext();
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }
  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { isPending: isDeletePending, mutateAsync: deleteMutation, } = useDeleteServiceById({ onSuccess: onDeleteSuccess, onError: onDeleteError })

  const handleAddService = () => router.push("/services/add");
  const handleEditService = (id: number) => router.push(`/services/edit/${id}`);
  const handleExploreService = (id: number) => router.push(`/services/${id}`);
  const handleDelete = async (id: number) => {
    showWarning({
      message: "Are you sure you want to delete this service?",
      btn1: "Cancel",
      btn2: "Delete",
      handleBtn2: () => deleteMutation(id),
    });
  };

  useEffect(() => {
    if (!loadMoreRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
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
        <h1 className="font-semibold text-2xl text-text">Services</h1>
        <Input
          placeholder="Search services..."
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
                msg="There are no services yet"
                action={
                  <Button
                    className="bg-main hover:bg-main-hover transition duration-300 text-face cursor-pointer"
                    onClick={handleAddService}
                  >
                    Add Service
                  </Button>
                }
              />
              : <div className="h-full overflow-y-auto min-w-[800px]" ref={containerRef}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.pages.map(
                      (page, pageIndex) =>
                        page?.data?.items?.length > 0 &&
                        page.data.items.map((service: GlobalService) => (
                          <TableRow
                            key={`${pageIndex}-${service.id}`}
                            className={cn(
                              "transition duration-300 hover:bg-gray-100"
                            )}
                          >
                            <TableCell className="text-center text-sm">{service.id}</TableCell>
                            <TableCell className="font-medium text-text">{service.title}</TableCell>
                            <TableCell className="text-sm text-text-muted max-w-xs truncate">
                              {service.description}
                            </TableCell>
                            <TableCell>{service.duration}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              ${service.price}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  className="bg-transparent shadow-none text-orange-500 hover:bg-orange-400 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
                                  disabled={isDeletePending}
                                  onClick={() => handleEditService(service.id)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  className="bg-transparent shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
                                  disabled={isDeletePending}
                                  onClick={() => handleDelete(service.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
                                  disabled={isDeletePending}
                                  onClick={() => handleExploreService(service.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>

                {hasNextPage && (
                  <LoadingElement
                    ref={loadMoreRef}
                    containerClasses="w-full py-2"
                    loaderClasses="w-5 h-5"
                  />
                )}
              </div>
        }
      </div>

      <Button
        onClick={handleAddService}
        className="bg-main hover:bg-main-hover py-1 px-4 rounded absolute bottom-5 right-5 transition duration-300 cursor-pointer"
      >
        Add
      </Button>
    </div>
  );
};

export default ServicesPage;
