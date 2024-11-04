import { useMutation as useReactMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

export function useMutation<TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  return useReactMutation({
    mutationFn,
    ...options,
  });
} 