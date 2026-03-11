"use client";

import React, { useEffect, useRef, useState } from "react";
import { Category, GlobalService } from "@/types/global";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import LoadingElement from "@/components/LoadingElement";
import { useGetAllServices } from "@/hooks/useService";
import { useDebouncedSearch } from "@/hooks/useHelpers";
import { Input } from "@/components/ui/input";
import { useGetAllCategoriesIdentities } from "@/hooks/useCategory";
import Selector from "@/components/forms/Selector";
import Service from "./Service";

const ClientServicesPage: React.FC = () => {
  const { search, setSearch, debouncedSearch } = useDebouncedSearch()
  const [categoryTitle, setCategoryTitle] = useState<string>("")

  const { data, fetchNextPage, hasNextPage, isFetching } = useGetAllServices(20, debouncedSearch, categoryTitle);
  const { data: categoriesData } = useGetAllCategoriesIdentities();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const categoryOptions =
    categoriesData?.data?.map((cat: Omit<Category, "desc" | "id">) => ({
      key: cat.title,
      value: cat.title,
    })) || [];

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
      <div className="mb-2 flex justify-between items-center flex-wrap">
        <h1 className="mb-2 md:mb-0 font-semibold text-2xl text-text">Services</h1>

        <div className="md:w-[75%] w-full flex md:flex-row flex-col items-center flex-wrap gap-2">
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          <Selector
            setFunction={setCategoryTitle}
            data={categoryOptions}
            placeholder="Category"
            styles="flex-1"
          />
        </div>
      </div>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-x-auto overflow-hidden">
        {
          isFetching
            ? <LoadingPage />
            : ((!data?.pages || !data.pages[0].data.items || !data.pages[0].data.items.length))
              ? <EmptyElement msg="There are no services yet" />
              : <div className="max-h-[100%] grid gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
                {data?.pages.map(
                  (page, pageIndex) =>
                    page?.data?.items?.length > 0 &&
                    page.data.items.map((service: GlobalService) => (
                      <Service service={service} key={`service-${pageIndex}-${service.id}`} />
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
        }
      </div>
    </div>
  );
};

export default ClientServicesPage;