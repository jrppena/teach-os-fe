/**
 * Lesson-plans · list / detail / delete API hooks.
 *
 * TanStack Query v5 hooks over the shared Axios client for the persisted
 * `/lesson-plans` history. The client unwraps `response.data`, attaches the
 * Firebase Bearer token, and surfaces errors through the notifications store.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { LessonPlanDetail, LessonPlanSummary } from "@/features/generate/types"

/** Stable query key for the lesson-plans collection. */
export const LESSON_PLANS_QUERY_KEY = ["lesson-plans"] as const

/**
 * Fetch the authenticated user's saved lesson plans (summaries, newest first).
 *
 * @returns A TanStack Query result with an array of {@link LessonPlanSummary}.
 */
export function useLessonPlans() {
  return useQuery<LessonPlanSummary[]>({
    queryKey: LESSON_PLANS_QUERY_KEY,
    queryFn: () => api.get("/lesson-plans") as unknown as Promise<LessonPlanSummary[]>,
  })
}

/**
 * Fetch one saved lesson plan in full.
 *
 * @param id - The plan id; the query is disabled until an id is present.
 * @returns A TanStack Query result with the {@link LessonPlanDetail}.
 */
export function useLessonPlan(id: string | undefined) {
  return useQuery<LessonPlanDetail>({
    queryKey: [...LESSON_PLANS_QUERY_KEY, id],
    queryFn: () => api.get(`/lesson-plans/${id}`) as unknown as Promise<LessonPlanDetail>,
    enabled: !!id,
  })
}

/**
 * Delete a saved lesson plan, then invalidate the list so the grid refetches.
 *
 * @returns A TanStack Query mutation; call `mutation.mutate(id)`.
 */
export function useDeleteLessonPlan() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/lesson-plans/${id}`) as unknown as Promise<void>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_PLANS_QUERY_KEY })
    },
  })
}
