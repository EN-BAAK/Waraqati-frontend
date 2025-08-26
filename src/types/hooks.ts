import { UseMutationOptions } from "@tanstack/react-query"
import { APIResponse } from "./global";

export type MutationProps<TData = unknown, TError = unknown, TVariables = void, TContext = unknown> = {
  onSuccess?: UseMutationOptions<TData, TError, TVariables, TContext>["onSuccess"];
  onError?: UseMutationOptions<TData, TError, TVariables, TContext>["onError"];
}

export type MutationFnType = Promise<APIResponse<unknown>>