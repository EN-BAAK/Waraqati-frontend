import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteServiceById,
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

export const useGetAllServices = (limit: number, title: string) => {
  return useInfiniteQuery({
    queryKey: ["services", limit],
    queryFn: ({ pageParam = 1 }) =>
      getAllServices({ limit, page: pageParam, title }),
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
    onSuccess: (data, err, context) => {
      queryClient.setQueryData<unknown>(
        ["services", 20],
        (oldData: InfinityResponse<GlobalService>) => {
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

      onSuccess?.(data, err, context);
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
    onSuccess: (resp, err, context) => {
      const updatedService: GlobalService = resp.data;

      queryClient.setQueryData<InfinityResponse<GlobalService>>(
        ["services", 20],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => {
            const items = page.data.items.map((s) =>
              s.id === updatedService.id ? updatedService : s
            );
            return {
              ...page,
              data: {
                ...page.data,
                items,
              },
            };
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );

      queryClient.setQueryData(["service", updatedService.id], resp);

      onSuccess?.(resp, err, context);
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
    onSuccess: (resp, err, context) => {
      const deletedId = resp.data.id;

      queryClient.setQueryData<InfinityResponse<GlobalService>>(
        ["services", 20],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => {
            const items = page.data.items.filter((s) => s.id !== deletedId);
            return {
              ...page,
              data: {
                ...page.data,
                items,
              },
            };
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );

      queryClient.removeQueries({ queryKey: ["service", deletedId] });

      onSuccess?.(resp, err, context);
    },
    onError,
  });
};
