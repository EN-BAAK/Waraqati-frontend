"use client";

import React, { useEffect, useRef } from "react";
import { GlobalClientRequest } from "@/types/global";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import LoadingElement from "@/components/LoadingElement";
import { useGetAllClientRequests } from "@/hooks/useRequests";
import RequestCard from "./Request";

const ClientRequestsPage: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useGetAllClientRequests(20);

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
      <h1 className="mb-4 font-semibold text-2xl text-text">My Requests</h1>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-x-auto overflow-hidden" ref={containerRef}>
        {isFetching ? (
          <LoadingPage />
        ) : (!data?.pages || !data.pages[0].data.items || !data.pages[0].data.items.length) ? (
          <EmptyElement msg="You have no requests yet" />
        ) : (
          <div className="max-h-[100%] grid gap-4 sm:grid-cols-1 lg:grid-cols-2 overflow-y-auto">
            {data.pages.map((page, pageIndex) =>
              page?.data?.items?.length > 0 &&
              page.data.items.map((request: GlobalClientRequest) => (
                <RequestCard request={request} key={`request-${pageIndex}-${request.id}`} />
              ))
            )}

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

export default ClientRequestsPage;