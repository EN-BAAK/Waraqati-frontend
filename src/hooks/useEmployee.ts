import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEmployee, deleteUserById, getAllEmployees, getEmployeeById, updateEmployee } from "@/api-client";
import { InfinityResponse, MutationFnType, MutationProps } from "@/types/hooks";
import { Employee, updateItemWithFormData } from "@/types/global";

export const useGetAllEmployees = (limit: number, search: string) => {
  return useInfiniteQuery({
    queryKey: ["employees", limit, search],
    queryFn: ({ pageParam = 1 }) =>
      getAllEmployees({ limit, page: pageParam, search }),
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

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (data, _, context) => {
      const allEmployeeQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["employees"], exact: false });

      allEmployeeQueries.forEach((query) => {
        const queryKey = query.queryKey as [string, number, string];
        const [, limit, search] = queryKey;

        if (search === "") {
          queryClient.setQueryData<InfinityResponse<Employee>>(queryKey, (oldData) => {
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

export const useUpdateEmployee = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, updateItemWithFormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (data, _, context) => {
      const allEmployeeQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["employees"], exact: false });

      allEmployeeQueries.forEach((query) => {
        const queryKey = query.queryKey as [string, number, string];
        queryClient.setQueryData<InfinityResponse<Employee>>(queryKey, (oldData) => {
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
      });

      queryClient.setQueryData(["employee", data.data.id], data);

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

  return useMutation({
    mutationFn: deleteUserById,
    onSuccess: (data, employeeId, context) => {
      const allEmployeeQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["employees"], exact: false });

      allEmployeeQueries.forEach((query) => {
        const queryKey = query.queryKey as [string, number, string];
        queryClient.setQueryData<InfinityResponse<Employee>>(queryKey, (oldData) => {
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
      });

      queryClient.removeQueries({ queryKey: ["employee", employeeId] });

      onSuccess?.(data, employeeId, context);
    },
    onError,
  });
};
