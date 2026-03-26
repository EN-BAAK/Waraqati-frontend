import { createRequest, getAllClientRequests, getAvailableRequests } from "@/api-client";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InfinityResponse, MutationFnType, MutationProps } from "@/types/hooks";
import { Request, RequestCreation } from "@/types/global";

export const useGetAllClientRequests = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["client-requests", limit],
    queryFn: ({ pageParam = 1 }) =>
      getAllClientRequests({ limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextPage : undefined,
    retry: false,
  });
};

export const useGetAvailableRequests = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["requests", "available", limit],
    queryFn: ({ pageParam = 1 }) =>
      getAvailableRequests({ limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextPage : undefined,
    retry: false,
  });
};

export const useCreateRequest = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, { serviceId: number, data: FormData }>) => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: (data, _, context) => {
      // queryClient.setQueryData<InfinityResponse<Request[]>>(
      //   ["requests", "mine"],
      //   (oldData) => {
      //     if (!oldData) return oldData;

      //     const firstPage = oldData.pages[0];
      //     if (!firstPage) return oldData;

      //     const updatedFirstPage = {
      //       ...firstPage,
      //       data: {
      //         ...firstPage.data,
      //         items: [data.data, ...firstPage.data.items],
      //       },
      //     };

      //     return {
      //       ...oldData,
      //       pages: [updatedFirstPage, ...oldData.pages.slice(1)],
      //     };
      //   }
      // );

      onSuccess?.(data, _, context);
    },
    onError,
  });
};