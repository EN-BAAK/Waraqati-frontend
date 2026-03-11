import { createRequest } from "@/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfinityResponse, MutationFnType, MutationProps } from "@/types/hooks";
import { Request } from "@/types/global";

export const useCreateRequest = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: (data, _, context) => {
      queryClient.setQueryData<InfinityResponse<Request[]>>(
        ["requests", "mine"],
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

      onSuccess?.(data, _, context);
    },
    onError,
  });
};