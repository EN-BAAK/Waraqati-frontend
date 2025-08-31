import { UseMutationOptions } from "@tanstack/react-query"

export type MutationProps<TData = unknown, TError = unknown, TVariables = void, TContext = unknown> = {
  onSuccess?: UseMutationOptions<TData, TError, TVariables, TContext>["onSuccess"];
  onError?: UseMutationOptions<TData, TError, TVariables, TContext>["onError"];
}

export type MutationFnType = Promise<APIResponse<unknown>>

export type APIResponse<T> = {
  message: string,
  success: boolean,
  data: T
}

export type InfiniteData<T> = {
  items: T[],
  hasMore: boolean,
  limit: number,
  page: number,
  total: number,
  totalPages: number
}

export type InfinityResponse<PageType> = {
  pages: APIResponse<InfiniteData<PageType>>[];
  pageParams: number[];
};