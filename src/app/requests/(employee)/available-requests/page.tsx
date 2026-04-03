"use client";

import React, { useEffect, useRef } from "react";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import LoadingElement from "@/components/LoadingElement";
import { useGetAvailableRequests } from "@/hooks/useRequests";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RequestRow from "../Request";
import { GlobalEmployeeRequest } from "@/types/global";

const RequestsPage: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useGetAvailableRequests(20);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      <h1 className="mb-4 font-semibold text-2xl text-text">Available Requests</h1>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-x-auto overflow-hidden" ref={containerRef}>
        {isFetching ? (
          <LoadingPage />
        ) : (!data?.pages || !data.pages[0].data.items || !data.pages[0].data.items.length) ? (
          <EmptyElement msg="There is no available requests yet" />
        ) : (
          <div className="h-full overflow-y-auto  min-w-[800px]" ref={containerRef}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.pages.map(
                  (page, pageIndex) =>
                    page?.data?.items?.length > 0 &&
                    page.data.items.map((request: GlobalEmployeeRequest) => (
                      <RequestRow key={`request-${pageIndex}-${request.id}`} request={request} />
                    ))
                )}
              </TableBody>
            </Table>

            {hasNextPage && <LoadingElement ref={loadMoreRef} containerClasses="w-full py-2" loaderClasses="w-5 h-5" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;