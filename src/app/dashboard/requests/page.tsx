"use client";

import React, { useEffect, useRef, useState } from "react";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import LoadingElement from "@/components/LoadingElement";
import { useGetAllManagerRequests } from "@/hooks/useRequests";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlobalManagerRequest } from "@/types/global";
import { useDebouncedSearch } from "@/hooks/useHelpers";
import Filter from "./Filter";
import RequestRow from "./Request";

const RequestsPage: React.FC = () => {
  const { search, debouncedSearch, setSearch } = useDebouncedSearch();
  const [category, setCategory] = useState<string>("");
  const [state, setState] = useState<string>("");

  const { data, fetchNextPage, hasNextPage, isFetching } = useGetAllManagerRequests(20, debouncedSearch.trim(), state.trim(), category.trim());

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
      <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
        <h1 className="font-semibold text-2xl text-text">Available Requests</h1>

        <Filter
          search={search}
          setSearch={setSearch}
          setState={setState}
          setCategory={setCategory}
        />
      </div>

      <div
        className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-x-auto overflow-hidden"
        ref={containerRef}
      >
        {isFetching ? (
          <LoadingPage />
        ) : !data?.pages || !data.pages[0].data.items || !data.pages[0].data.items.length ? (
          <EmptyElement msg="There are no available requests yet" />
        ) : (
          <div className="h-full overflow-y-auto min-w-[900px]" ref={containerRef}>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-back hover:bg-back">
                  <TableHead className="pl-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Client
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Employee
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Service
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Requested At
                  </TableHead>
                  <TableHead className="pr-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.pages.map(
                  (page, pageIndex) =>
                    page?.data?.items?.length > 0 &&
                    page.data.items.map((request: GlobalManagerRequest) => (
                      <RequestRow
                        key={`request-${pageIndex}-${request.id}`}
                        request={request}
                      />
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
        )}
      </div>
    </div>
  );
};

export default RequestsPage;