import { getEmployeeRate, getMyRequestRate, getServiceRate, rateRequest } from "@/api-client";
import { MutationFnType, MutationProps } from "@/types/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetClientRate = (requestId: number) => {
  return useQuery({
    queryKey: ["client-rate", requestId],
    queryFn: () => getMyRequestRate(requestId),
  });
};

export const useGetServiceRate = (serviceId: number) => {
  return useQuery({
    queryKey: ["service-rate", serviceId],
    queryFn: () => getServiceRate(serviceId),
  });
};

export const useGetEmployeeRate = (employeeId: number) => {
  return useQuery({
    queryKey: ["employee-rate", employeeId],
    queryFn: () => getEmployeeRate(employeeId),
  });
};

export const useRateRequest = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, { requestId: number, rate: number }>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rateRequest,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["client-rate", variables.requestId], data)
      onSuccess?.(data, variables, context)
    },
    onError,
  })
}