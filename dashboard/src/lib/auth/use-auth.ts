'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { moderatorAuthClient, type Moderator } from './moderator-auth-client';

export function useSession() {
  return useQuery({
    queryKey: ['moderator-auth', 'moderator-session'],
    queryFn: () => moderatorAuthClient.getSession(),
    staleTime: 5 * 60 * 1000, // 5 min
    retry: false,
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: moderator, isLoading, isFetched } = useSession();

  const logoutMutation = useMutation({
    mutationFn: () => moderatorAuthClient.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['moderator-auth', 'moderator-session'], null);
      toast.success('Logged out');
    },
  });

  return {
    moderator: moderator ?? null,
    isLoading,
    isAuthenticated: Boolean(moderator),
    isReady: isFetched,
    logout: () => logoutMutation.mutateAsync(),
  };
}
