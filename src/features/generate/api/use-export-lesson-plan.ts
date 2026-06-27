/**
 * Lesson-plan export hook.
 *
 * TanStack mutations that POST the current plan draft to the backend and trigger
 * a browser file download of the returned binary. Two formats are supported:
 *
 * - ``useExportLessonPlan("docx")`` → ``POST /lesson-plans/{id}/export``
 * - ``useExportLessonPlan("pdf")``  → ``POST /lesson-plans/{id}/export/pdf``
 *
 * The draft sent in the body reflects the teacher's current on-screen state
 * (including any unsaved local edits from the Edit toggle in StepResult).
 *
 * The shared Axios interceptor unwraps ``response.data``, so each hook receives
 * the raw Blob directly. Errors are surfaced through the existing notifications
 * path by the interceptor.
 */

import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { GeneratedLessonPlan } from "@/features/generate/types"

/** Supported export formats. */
export type ExportFormat = "docx" | "pdf"

/** Arguments for the export mutation. */
export interface ExportLessonPlanArgs {
  planId: string
  plan: GeneratedLessonPlan
}

/**
 * Download a DOCX or PDF export of the given lesson-plan draft.
 *
 * POSTs the draft to the backend for the requested format, receives a binary
 * blob, and triggers a browser download using a temporary object URL.
 *
 * @param format - ``"docx"`` (default) or ``"pdf"``.
 * @returns A TanStack mutation object. Call ``mutation.mutate({ planId, plan })``
 *   to kick off the export.
 */
export function useExportLessonPlan(format: ExportFormat = "docx") {
  return useMutation<void, Error, ExportLessonPlanArgs>({
    mutationFn: async ({ planId, plan }) => {
      const endpoint =
        format === "pdf"
          ? `/lesson-plans/${planId}/export/pdf`
          : `/lesson-plans/${planId}/export`

      const blob = await api.post(endpoint, plan, {
        responseType: "blob",
      }) as unknown as Blob

      // Derive a filename from the lesson title (fallback to generic name).
      const slug =
        plan.lessonInformation.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_]+/g, "-")
          .slice(0, 60)
          .replace(/^-+|-+$/g, "") || "lesson-plan"

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${slug}.${format}`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
    },
  })
}
