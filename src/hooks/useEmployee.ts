import { Query, QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEmployee, deleteUserById, getAllEmployees, getEmployeeById, updateEmployee } from "@/api-client";
import { InfinityResponse, MutationFnType, MutationProps, QueryKey } from "@/types/hooks";
import { Employee, Update_Offset_Unit_Process, updateItemWithFormData } from "@/types/global";
import { useOffsetContext } from "@/contexts/OffsetsProvider";

const baseKey = ["employees", ""]

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

export const useGetAllEmployees = (limit: number, search: string) => {
  const { getOffsetUnit } = useOffsetContext()
  const offsetUnit = getOffsetUnit(baseKey)

  return useInfiniteQuery({
    queryKey: ["employees", search],
    queryFn: ({ pageParam = 1 }) =>
      getAllEmployees({ limit, page: pageParam, offsetUnit, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextPage : undefined,
    retry: false,
  });
};

export const useGetEmployeeById = (id: number) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    refetchOnMount: "always",
    gcTime: 0
  });
};

export const useCreateEmployee = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, FormData>) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (data, _, context) => {
      queryClient.setQueryData<InfinityResponse<Employee>>(baseKey, (oldData) => {
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

      invalidateSearchQueries(queryClient, "employees");
      updateOffsetUnit(baseKey, Update_Offset_Unit_Process.UP);
      onSuccess?.(data, _, context);
    },
    onError,
  });
};

export const useUpdateEmployee = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, updateItemWithFormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (data, _, context) => {
      queryClient.setQueryData<InfinityResponse<Employee>>(baseKey,
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((emp) =>
                emp.id === data.data.id ? data.data : emp
              ),
            },
          }));

          return { ...oldData, pages: updatedPages };
        });

      queryClient.setQueryData(["employee", data.data.id], data);
      invalidateSearchQueries(queryClient, "employees");
      onSuccess?.(data, _, context);
    },
    onError,
  });
};

export const useDeleteEmployeeById = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()

  return useMutation({
    mutationFn: deleteUserById,
    onSuccess: (data, employeeId, context) => {
      queryClient.setQueryData<InfinityResponse<Employee>>(baseKey, (oldData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.filter((emp) => emp.id !== employeeId),
          },
        }));

        return { ...oldData, pages: updatedPages };
      });

      queryClient.removeQueries({ queryKey: ["employee", employeeId] });
      invalidateSearchQueries(queryClient, "employees");
      updateOffsetUnit(baseKey, Update_Offset_Unit_Process.DOWN);
      onSuccess?.(data, employeeId, context);
    },
    onError,
  });
};
