import { createClient, deleteUserById, getAllClients, getClientById, updateClient, updateClientSpecialization } from "@/api-client";
import { useOffsetContext } from "@/contexts/OffsetsProvider";
import { UpdateClientSpecializationProps } from "@/types/forms";
import { Client, Update_Offset_Unit_Process, updateItemWithFormData } from "@/types/global";
import { InfinityResponse, MutationFnType, MutationProps, QueryKey } from "@/types/hooks";
import { Query, QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const baseKey = ["clients", ""]

const invalidateSearchQueries = (queryClient: QueryClient, resource: QueryKey) => {
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

export const useGetAllClients = (limit: number, search: string) => {
  const { getOffsetUnit } = useOffsetContext()
  const offsetUnit = getOffsetUnit(baseKey)

  return useInfiniteQuery({
    queryKey: ["clients", search],
    queryFn: ({ pageParam = 1 }) =>
      getAllClients({ limit, page: pageParam, offsetUnit, search }),
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
    gcTime: 0,
  });
};

export const useCreateClient = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, FormData>) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()

  return useMutation({
    mutationFn: createClient,
    onSuccess: (data, _, context) => {
      queryClient.setQueryData<InfinityResponse<Client>>(baseKey, (oldData) => {
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

      invalidateSearchQueries(queryClient, "clients");
      updateOffsetUnit(baseKey, Update_Offset_Unit_Process.UP);
      onSuccess?.(data, _, context);
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
    onSuccess: (data, _, context) => {
      queryClient.setQueryData<InfinityResponse<Client>>(baseKey, (oldData) => {
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
      });

      queryClient.setQueryData(["client", data.data.id], data);
      invalidateSearchQueries(queryClient, "clients");
      onSuccess?.(data, _, context);
    },
    onError,
  });
};

export const useUpdateClientSpecialization = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, UpdateClientSpecializationProps>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientSpecialization,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<InfinityResponse<Client>>(baseKey, (oldData) => {
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
      });

      queryClient.setQueryData(["client", data.data.id], data);
      invalidateSearchQueries(queryClient, "clients");
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
  const { updateOffsetUnit } = useOffsetContext()

  return useMutation({
    mutationFn: deleteUserById,
    onSuccess: (data, clientId, context) => {
      queryClient.setQueryData<InfinityResponse<Client>>(baseKey, (oldData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.filter((client) => client.id !== clientId),
          },
        }));

        return { ...oldData, pages: updatedPages };
      });

      queryClient.removeQueries({ queryKey: ["client", clientId] });
      updateOffsetUnit(baseKey, Update_Offset_Unit_Process.DOWN);
      invalidateSearchQueries(queryClient, "clients");
      onSuccess?.(data, clientId, context);
    },
    onError,
  });
};
