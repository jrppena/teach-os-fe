/**
 * Feedback · domain model.
 *
 * Shared types for the user feedback form. These mirror the backend
 * ``/feedback`` contract (camelCase ``FeedbackCreate`` / ``FeedbackResponse``)
 * so the seam in {@link useSubmitFeedback} is typed end-to-end.
 */

/** Category a teacher assigns to a feedback submission. Matches the backend ``FeedbackCategory`` StrEnum. */
export type FeedbackCategory =
  | "GENERAL"
  | "BUG"
  | "FEATURE_REQUEST"
  | "LESSON_PLAN_QUALITY"

/** Static, display-time metadata for a category (id + human label). */
export interface FeedbackCategoryMeta {
  id: FeedbackCategory
  label: string
}

/**
 * Category catalogue. Order here drives the select's render order.
 * ``GENERAL`` is first so it is the sensible default.
 */
export const FEEDBACK_CATEGORIES: FeedbackCategoryMeta[] = [
  { id: "GENERAL", label: "General feedback" },
  { id: "BUG", label: "Report a bug" },
  { id: "FEATURE_REQUEST", label: "Feature request" },
  { id: "LESSON_PLAN_QUALITY", label: "Lesson plan quality" },
]

/** Body accepted by ``POST /feedback``. */
export interface SubmitFeedbackInput {
  category: FeedbackCategory
  /** Optional 1–5 satisfaction score. */
  rating?: number
  message: string
}

/** Record returned by ``POST /feedback`` (the FE ``Feedback`` shape). */
export interface Feedback {
  id: string
  category: FeedbackCategory
  rating: number | null
  message: string
  createdAt: string
}
