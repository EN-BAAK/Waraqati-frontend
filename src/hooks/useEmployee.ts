import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee, getAllEmployees } from "@/api-client";
import { InfinityResponse, MutationFnType, MutationProps } from "@/types/hooks";
import { Employee } from "@/types/global";

export const useGetAllEmployees = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["employees", limit],
    queryFn: ({ pageParam = 1 }) => getAllEmployees({ limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) return lastPage.nextPage;
      return undefined;
    },
    retry: false,
  });
};

export const useCreateEmployee = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, FormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (data, err, context) => {
      queryClient.setQueryData<unknown>(["employees", 20], (oldData: InfinityResponse<Employee>) => {
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