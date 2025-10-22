import {
  createService,
  getAllServices,
  getCategoricServiceById,
  updateService,
  deleteServiceById,
  getServiceById,
} from "@/api-client";
import {
  GlobalService,
  ServiceCreation,
  updateItemWithType,
} from "@/types/global";
import {
  InfinityResponse,
  MutationFnType,
  MutationProps,
} from "@/types/hooks";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetAllServices = (limit: number, title: string, category: string) => {
  return useInfiniteQuery({
    queryKey: ["services", limit, title, category],
    queryFn: ({ pageParam = 1 }) =>
      getAllServices({ limit, page: pageParam, title, category }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextPage : undefined,
    retry: false,
  });
};

export const useGetCategoricServiceById = (id: number) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getCategoricServiceById(id),
    refetchOnMount: "always",
    gcTime: 0,
  });
};

export const useGetServiceById = (id: number) => {
  return useQuery({
    queryKey: ["service-detailed", id],
    queryFn: () => getServiceById(id),
    refetchOnMount: "always",
    gcTime: 0,
  });
};

export const useCreateService = ({
  onSuccess,
  onError,
}: MutationProps<
  Awaited<MutationFnType>,
  Error,
  ServiceCreation
>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: (data, _, context) => {
      const allServiceQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["services"], exact: false });

      allServiceQueries.forEach((query) => {
        const queryKey = query.queryKey as [string, number, string];
        const [, limit, title] = queryKey;

        if (title === "") {
          queryClient.setQueryData<InfinityResponse<GlobalService>>(queryKey, (oldData) => {
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
          });
        }
      });

      onSuccess?.(data, _, context);
    },
    onError,
  });
};

export const useUpdateService = ({
  onSuccess,
  onError,
}: MutationProps<
  Awaited<MutationFnType>,
  Error,
  updateItemWithType<Partial<ServiceCreation>>
>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ServiceCreation> }) =>
      updateService({ id, data }),
    onSuccess: (resp, _, context) => {
      const updatedService: GlobalService = resp.data;

      const allServiceQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["services"], exact: false });

      allServiceQueries.forEach((query) => {
        const queryKey = query.queryKey as [string, number, string];
        queryClient.setQueryData<InfinityResponse<GlobalService>>(queryKey, (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((s) =>
                s.id === updatedService.id ? updatedService : s
              ),
            },
          }));

          return { ...oldData, pages: updatedPages };
        });
      });

      queryClient.setQueryData(["service", updatedService.id], resp);

      onSuccess?.(resp, _, context);
    },
    onError,
  });
};

export const useDeleteServiceById = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteServiceById(id),
    onSuccess: (resp, _, context) => {
      const deletedId = resp.data.id;

      const allServiceQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["services"], exact: false });

      allServiceQueries.forEach((query) => {
        const queryKey = query.queryKey as [string, number, string];
        queryClient.setQueryData<InfinityResponse<GlobalService>>(queryKey, (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.filter((s) => s.id !== deletedId),
            },
          }));

          return { ...oldData, pages: updatedPages };
        });
      });

      queryClient.removeQueries({ queryKey: ["service", deletedId] });

      onSuccess?.(resp, _, context);
    },
    onError,
  });
};
