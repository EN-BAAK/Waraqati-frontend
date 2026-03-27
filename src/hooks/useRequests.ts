import { createRequest, getAllClientRequests, getAvailableRequests, workOnDemand } from "@/api-client";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InfinityResponse, MutationFnType, MutationProps } from "@/types/hooks";
import { Request, REQUESTS_STATE } from "@/types/global";

export const useGetAllClientRequests = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["client-requests"],
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
    queryKey: ["requests", REQUESTS_STATE.IN_QUEUE],
    queryFn: ({ pageParam = 1 }) =>
      getAvailableRequests({ limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextPage : undefined,
    retry: false,
  });
};

export const useCreateRequest = ({ onSuccess, onError, }: MutationProps<Awaited<MutationFnType>, Error, { serviceId: number, data: FormData }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: (data, values, context) => {
      queryClient.setQueryData<InfinityResponse<Request>>(
        ["client-requests"],
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          if (!firstPage) return oldData;

          const updatedFirstPage = {
            ...firstPage,
            data: {
              ...firstPage.data,
              items: [data.data, ...firstPage.data.items],
            },
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );

      onSuccess?.(data, values, context);
    },
    onError,
  });
};

export const useWorkOnDemand = ({ onSuccess, onError, }: MutationProps<Awaited<MutationFnType>, Error, { requestId: number }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workOnDemand,

    onSuccess: (data, values, context) => {
      const newRequest = data.data;

      queryClient.setQueryData<InfinityResponse<Request>>(
        ["requests", REQUESTS_STATE.IN_QUEUE],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter(
                  (item) => item.id !== newRequest.id
                ),
              },
            })),
          };
        }
      );

      queryClient.setQueryData<InfinityResponse<Request>>(
        ["requests", REQUESTS_STATE.IN_HOLD],
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          if (!firstPage) return oldData;

          const updatedFirstPage = {
            ...firstPage,
            data: {
              ...firstPage.data,
              items: [newRequest, ...firstPage.data.items],
            },
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );

      onSuccess?.(data, values, context);
    },

    onError,
  });
};