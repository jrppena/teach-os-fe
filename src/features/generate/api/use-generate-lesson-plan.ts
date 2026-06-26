/**
 * Lesson-plans · generation mutation hook.
 *
 * Calls `POST /lesson-plans` with the wizard inputs and returns the saved
 * {@link LessonPlanDetail} (full plan + id). On success it invalidates the
 * lesson-plans list so the dashboard history shows the new plan. Replaces the
 * former local `mock-generator.ts` seam — the response shape is unchanged.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type {
  LessonPlanDetail,
  LessonPlanGenerateRequest,
} from "@/features/generate/types"
import { LESSON_PLANS_QUERY_KEY } from "./use-lesson-plans"

/**
 * Generate and persist an ILAW lesson plan via the user's active AI provider.
 *
 * @returns A TanStack Query mutation; call `mutation.mutate(request)` with a
 *   {@link LessonPlanGenerateRequest}. `mutation.isPending` drives the wizard's
 *   loading state; the `onSuccess` payload carries the renderable plan under `plan`.
 */
export function useGenerateLessonPlan() {
  const queryClient = useQueryClient()

  return useMutation<LessonPlanDetail, Error, LessonPlanGenerateRequest>({
    mutationFn: (body) =>
      api.post("/lesson-plans", body) as unknown as Promise<LessonPlanDetail>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_PLANS_QUERY_KEY })
    },
  })
}
