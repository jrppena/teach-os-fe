/**
 * Lesson-plan export hook.
 *
 * TanStack mutation that POSTs the current plan draft to
 * ``POST /lesson-plans/{id}/export`` and triggers a browser file download of
 * the returned DOCX binary. The draft sent in the body reflects the teacher's
 * current on-screen state (including any unsaved local edits from the Edit
 * toggle in StepResult).
 *
 * The shared Axios interceptor unwraps ``response.data``, so this hook receives
 * the raw Blob directly. Errors are surfaced through the existing notifications
 * path by the interceptor.
 */

import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { GeneratedLessonPlan } from "@/features/generate/types"

/** Arguments for the export mutation. */
export interface ExportLessonPlanArgs {
  planId: string
  plan: GeneratedLessonPlan
}

/**
 * Download a DOCX export of the given lesson-plan draft.
 *
 * POSTs the draft to the backend, receives a DOCX binary blob, and triggers a
 * browser download using a temporary object URL.
 *
 * @returns A TanStack mutation object. Call ``mutation.mutate({ planId, plan })``
 *   to kick off the export.
 */
export function useExportLessonPlan() {
  return useMutation<void, Error, ExportLessonPlanArgs>({
    mutationFn: async ({ planId, plan }) => {
      const blob = await api.post(`/lesson-plans/${planId}/export`, plan, {
        responseType: "blob",
      }) as unknown as Blob

      // Derive a filename from the lesson title (fallback to generic name).
      const slug = plan.lessonInformation.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .slice(0, 60)
        .replace(/^-+|-+$/g, "") || "lesson-plan"

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${slug}.docx`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
    },
  })
}
