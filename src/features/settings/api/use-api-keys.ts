/**
 * Settings · Provider-key API hooks.
 *
 * TanStack Query v5 hooks that talk to ``GET /settings/provider-keys`` and
 * ``PATCH /settings/provider-keys`` via the shared Axios client. The client
 * unwraps ``response.data``, attaches the Firebase Bearer token, and surfaces
 * errors through the Zustand notifications store automatically.
 *
 * These hooks replace the former ``localStorage`` seam — no local state is
 * read or written by this module.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { ProviderKeysResponse, ProviderKeysUpdate } from "@/features/settings/types"

/** Stable query key for the provider-keys resource. */
export const PROVIDER_KEYS_QUERY_KEY = ["provider-keys"] as const

/**
 * Fetch the masked provider-key status for the authenticated user.
 *
 * @returns A TanStack Query result containing {@link ProviderKeysResponse}
 *   (``activeProvider`` + masked ``keys`` per provider). The raw API key is
 *   never returned — only ``configured`` + ``preview``.
 */
export function useProviderKeys() {
  return useQuery<ProviderKeysResponse>({
    queryKey: PROVIDER_KEYS_QUERY_KEY,
    queryFn: () => api.get("/settings/provider-keys") as unknown as Promise<ProviderKeysResponse>,
  })
}

/**
 * Partially update provider settings for the authenticated user.
 *
 * On success, invalidates the ``provider-keys`` query so the UI refetches the
 * latest masked state from the server.
 *
 * @returns A TanStack Query mutation object. Call ``mutation.mutate(body)`` with
 *   a {@link ProviderKeysUpdate} — all fields optional.
 */
export function useUpdateProviderKeys() {
  const queryClient = useQueryClient()

  return useMutation<ProviderKeysResponse, Error, ProviderKeysUpdate>({
    mutationFn: (body) =>
      api.patch("/settings/provider-keys", body) as unknown as Promise<ProviderKeysResponse>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDER_KEYS_QUERY_KEY })
    },
  })
}
