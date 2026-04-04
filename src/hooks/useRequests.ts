import { createRequest, getAllClientRequests, getAllEmployeeRequests, getAvailableRequests, requestStateTransaction } from "@/api-client";
import { Query, QueryClient, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InfinityResponse, MutationFnType, MutationProps, QueryKey } from "@/types/hooks";
import { GlobalClientRequest, GlobalEmployeeRequest, REQUESTS_STATE } from "@/types/global";

const baseEmployeeKey = ["employee-requests", "", "", ""]

const invalidateEmployeeSearchQueries = (queryClient: QueryClient, resource: QueryKey) => {
  queryClient.removeQueries({
    predicate: (query: Query) => {
      const key = query.queryKey;

      return (
        key[0] === resource &&
        key.slice(1).some((k) => k !== "")
      );
    },
  });
};

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

export const useGetAllEmployeeRequests = (limit: number, search: string, state: string, category: string,) => {
  return useInfiniteQuery({
    queryKey: ["employee-requests", search, state, category],
    queryFn: ({ pageParam = 1 }) =>
      getAllEmployeeRequests({ limit, page: pageParam, category, search, state }),
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
      queryClient.setQueryData<InfinityResponse<GlobalClientRequest>>(
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

export const useRequestStateTransaction = ({ onSuccess, onError, }: MutationProps<Awaited<MutationFnType>, Error, { requestId: number, state: REQUESTS_STATE, role: "manager" | "employee" }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestStateTransaction,

    onSuccess: (data, values, context) => {
      const updatedRequest = data.data;

      if (values.state === REQUESTS_STATE.IN_HOLD) {
        let translatingRequest: GlobalEmployeeRequest;

        queryClient.setQueryData<InfinityResponse<GlobalEmployeeRequest>>(["requests", REQUESTS_STATE.IN_QUEUE],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.filter((item) => {
                    if (item.id === updatedRequest.id) {
                      translatingRequest = item;
                      return false;
                    }
                    return true;
                  })
                },
              })),
            };
          }
        );

        queryClient.setQueryData<InfinityResponse<GlobalEmployeeRequest>>(baseEmployeeKey,
          (oldData) => {
            if (!oldData) return oldData;

            const firstPage = oldData.pages[0];
            if (!firstPage) return oldData;

            const updatedFirstPage = {
              ...firstPage,
              data: {
                ...firstPage.data,
                items: [{ ...translatingRequest, state: values.state }, ...firstPage.data.items],
              },
            };

            return {
              ...oldData,
              pages: [updatedFirstPage, ...oldData.pages.slice(1)],
            };
          }
        );
      } else if (values.state === REQUESTS_STATE.IN_QUEUE) {
        let translatingRequest: GlobalEmployeeRequest;

        queryClient.setQueryData<InfinityResponse<GlobalEmployeeRequest>>(baseEmployeeKey,
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.filter((item) => {
                    if (item.id === updatedRequest.id) {
                      translatingRequest = item;
                      return false;
                    }
                    return true;
                  })
                },
              })),
            };
          }
        );

        queryClient.setQueryData<InfinityResponse<GlobalEmployeeRequest>>(["requests", REQUESTS_STATE.IN_QUEUE],
          (oldData) => {
            if (!oldData) return oldData;

            const firstPage = oldData.pages[0];
            if (!firstPage) return oldData;

            const updatedFirstPage = {
              ...firstPage,
              data: {
                ...firstPage.data,
                items: [{ ...translatingRequest, state: values.state }, ...firstPage.data.items],
              },
            };

            return {
              ...oldData,
              pages: [updatedFirstPage, ...oldData.pages.slice(1)],
            };
          }
        );
      } else {
        queryClient.setQueryData<InfinityResponse<GlobalEmployeeRequest>>(baseEmployeeKey,
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.map(
                    (item) => item.id === updatedRequest.id ? { ...item, state: values.state } : item
                  ),
                },
              })),
            };
          }
        );
      }

      invalidateEmployeeSearchQueries(queryClient, "employee-requests");
      onSuccess?.(data, values, context);
    },

    onError,
  });
};