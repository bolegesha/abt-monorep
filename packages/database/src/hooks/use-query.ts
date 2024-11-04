import { useQuery as useReactQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

export function useQuery<TData, TError = Error>(
  key: string[],
  fetcher: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  return useReactQuery({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  });
} 