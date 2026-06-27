/**
 * Curriculum reference-data API hooks.
 *
 * TanStack Query v5 hooks over the shared Axios client for the read-only
 * `/curriculum` endpoints that back the lesson-plan Grade Level and Subject
 * dropdowns. The client unwraps `response.data`, attaches the Firebase Bearer
 * token, and surfaces errors through the notifications store. The data is static
 * DepEd reference data, so queries never go stale within a session.
 */

import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { GradeLevel, Subject } from "@/features/generate/types"

/** Stable query-key root for curriculum reference data. */
export const CURRICULUM_QUERY_KEY = ["curriculum"] as const

/**
 * Fetch all DepEd grade levels (Grade 1-12), ordered for display.
 *
 * @returns A TanStack Query result with an array of {@link GradeLevel}.
 */
export function useGradeLevels() {
  return useQuery<GradeLevel[]>({
    queryKey: [...CURRICULUM_QUERY_KEY, "grade-levels"],
    queryFn: () =>
      api.get("/curriculum/grade-levels") as unknown as Promise<GradeLevel[]>,
    staleTime: Infinity,
  })
}

/**
 * Fetch the subjects for one grade level.
 *
 * @param gradeCode - The grade's stable code (e.g. "GRADE_7"). The query is
 *   disabled until a code is provided (dependent on the selected grade).
 * @returns A TanStack Query result with an array of {@link Subject}.
 */
export function useSubjects(gradeCode: string | undefined) {
  return useQuery<Subject[]>({
    queryKey: [...CURRICULUM_QUERY_KEY, "grade-levels", gradeCode, "subjects"],
    queryFn: () =>
      api.get(
        `/curriculum/grade-levels/${gradeCode}/subjects`,
      ) as unknown as Promise<Subject[]>,
    enabled: !!gradeCode,
    staleTime: Infinity,
  })
}
