/**
 * Feedback · submit API hook.
 *
 * TanStack mutation that POSTs a feedback submission to ``/feedback`` via the
 * shared Axios client (which attaches the Firebase Bearer token, unwraps
 * ``response.data``, and surfaces errors through the notifications store). On
 * success it pushes a success toast so the teacher gets confirmation.
 */

import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { useNotifications } from "@/components/ui/notification"
import type { Feedback, SubmitFeedbackInput } from "@/features/feedback/types"

/**
 * Submit product feedback for the authenticated teacher.
 *
 * On success, shows a "Feedback sent" success notification. Errors are surfaced
 * automatically by the Axios response interceptor.
 *
 * @returns A TanStack mutation object. Call ``mutation.mutate(body)`` with a
 *   {@link SubmitFeedbackInput}.
 */
export function useSubmitFeedback() {
  return useMutation<Feedback, Error, SubmitFeedbackInput>({
    mutationFn: (body) => api.post("/feedback", body) as unknown as Promise<Feedback>,
    onSuccess: () => {
      useNotifications.getState().addNotification({
        type: "success",
        title: "Feedback sent",
        message: "Thank you — your feedback helps us improve TeachOS.",
      })
    },
  })
}
