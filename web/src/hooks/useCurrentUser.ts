"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, queryKeys } from "@/lib/queries";
import { User } from "@/types";

export function useCurrentUser() {
  const queryClient = useQueryClient();
  const { data: user, isPending } = useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });

  const updateUser = (updater: (previous: User) => User) => {
    queryClient.setQueryData<User>(queryKeys.me, (previous) =>
      previous ? updater(previous) : previous
    );
  };

  return { user: user ?? null, loading: isPending, updateUser };
}
