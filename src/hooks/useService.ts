import { getAllServices, getServiceById } from "@/api-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetAllServices = (limit: number, title: string) => {
  return useInfiniteQuery({
    queryKey: ["services", limit],
    queryFn: ({ pageParam = 1 }) => getAllServices({ limit, page: pageParam, title }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasMore) return lastPage.data.nextPage;
      return undefined;
    },
    retry: false,
  });
};

export const useGetServiceById = (id: number) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    refetchOnMount: "always",
    gcTime: 0
  })
}