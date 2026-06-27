/**
 * Settings · Update-profile API hook.
 *
 * TanStack mutation that PATCHes ``/auth/user`` with the teacher's school
 * information fields (school name, region, division, district, address). On
 * success, the cached user record is invalidated so the rest of the app sees
 * the updated values.
 *
 * These fields populate the DepEd school header block in exported DOCX lesson
 * plans and are stored on the backend ``user`` table.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { USER_QUERY_KEY } from "@/lib/auth"
import type { User } from "@/types/api"

/** Body accepted by ``PATCH /auth/user``. All fields are optional. */
export interface UpdateProfileInput {
  schoolName?: string
  region?: string
  division?: string
  district?: string
  schoolAddress?: string
}

/**
 * Partially update the authenticated teacher's school profile fields.
 *
 * On success, invalidates the user query so ``useUser()`` refetches the latest
 * profile from the server.
 *
 * @returns A TanStack mutation object. Call ``mutation.mutate(body)`` with an
 *   {@link UpdateProfileInput} — all fields optional.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation<User, Error, UpdateProfileInput>({
    mutationFn: (body) => api.patch("/auth/user", body) as unknown as Promise<User>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })
}
