import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createEmployee, getAllEmployees } from "@/api-client";
import { MutationFnType, MutationProps } from "@/types/hooks";

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

export const useCreateEmployee = (
  { onSuccess, onError }: MutationProps<
    Awaited<MutationFnType>,
    Error,
    FormData
  >
) => {
  return useMutation({
    mutationFn: createEmployee,
    onSuccess,
    onError
  })
}