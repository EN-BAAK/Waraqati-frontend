import { createClient, deleteUserById, getAllClients, getClientById, updateClient, updateClientSpecialization } from "@/api-client";
import { updateClientSpecializationProps } from "@/types/forms";
import { Client, updateItemWithFormData } from "@/types/global";
import { InfinityResponse, MutationFnType, MutationProps } from "@/types/hooks";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllClients = (limit: number, search: string) => {
  return useInfiniteQuery({
    queryKey: ["clients", limit, search],
    queryFn: ({ pageParam = 1 }) =>
      getAllClients({ limit, page: pageParam, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextPage : undefined,
    retry: false,
  });
};

export const useGetClientById = (id: number) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
    refetchOnMount: "always",
    gcTime: 0
  })
}

export const useCreateClient = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, FormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: (data, err, context) => {
      queryClient.setQueryData<unknown>(["clients", 20], (oldData: InfinityResponse<Client>) => {
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

      onSuccess?.(data, err, context);
    },
    onError,
  });
};

export const useUpdateClient = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, updateItemWithFormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,
    onSuccess: (data, err, context) => {
      queryClient.setQueryData<InfinityResponse<Client>>(
        ["clients", 20],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((client) =>
                client.id === data.data.id ? data.data : client
              ),
            },
          }));

          return { ...oldData, pages: updatedPages };
        }
      );

      onSuccess?.(data, err, context);
    },
    onError,
  });
};

export const useUpdateClientSpecialization = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, updateClientSpecializationProps>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientSpecialization,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<InfinityResponse<Client>>(
        ["clients", 20],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((client) =>
                client.id === data.data.id
                  ? { ...client, isSpecial: data.data.isSpecial }
                  : client
              ),
            },
          }));

          return { ...oldData, pages: updatedPages };
        }
      );

      onSuccess?.(data, variables, context);
    },
    onError,
  });
};

export const useDeleteClientById = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserById,
    onSuccess: (data, clientId, context) => {
      queryClient.setQueryData<InfinityResponse<Client>>(
        ["clients", 20],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.filter((client) => client.id !== clientId),
            },
          }));

          return { ...oldData, pages: updatedPages };
        }
      );

      queryClient.removeQueries({ queryKey: ["client", clientId] });

      onSuccess?.(data, clientId, context);
    },
    onError,
  });
};