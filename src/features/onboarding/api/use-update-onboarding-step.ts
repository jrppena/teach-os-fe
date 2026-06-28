/**
 * Onboarding · update-step API hook.
 *
 * TanStack mutation that PATCHes ``/auth/onboarding`` to advance (or complete)
 * the authenticated teacher's onboarding step. On success it writes the returned
 * user straight into the react-query-auth cache via ``setQueryData`` — an
 * instant, flicker-free update (the same pattern the Google-auth hooks use),
 * rather than invalidating and refetching. This keeps the wizard and the
 * RequireOnboarded guard in sync immediately.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { USER_QUERY_KEY } from "@/lib/auth"
import type { OnboardingStep, User } from "@/types/api"

/** Body accepted by ``PATCH /auth/onboarding``. */
export interface UpdateOnboardingStepInput {
  step: OnboardingStep
}

/**
 * Advance the authenticated teacher's onboarding step.
 *
 * On success, updates the cached user so ``useUser()`` immediately reflects the
 * new step (no refetch flicker).
 *
 * @returns A TanStack mutation object. Call ``mutation.mutate({ step })`` or
 *   ``mutateAsync`` to await the persisted transition before navigating.
 */
export function useUpdateOnboardingStep() {
  const queryClient = useQueryClient()

  return useMutation<User, Error, UpdateOnboardingStepInput>({
    mutationFn: (body) =>
      api.patch("/auth/onboarding", body) as unknown as Promise<User>,
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user)
    },
  })
}
