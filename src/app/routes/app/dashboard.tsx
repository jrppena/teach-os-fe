/**
 * Dashboard — index route of the authenticated app (`/app`).
 *
 * Greets the signed-in user and lists their saved lesson plans as a responsive
 * card grid, backed by `GET /lesson-plans`. Cards open the plan detail view
 * (`/plans/:id`) for review/edit and support delete.
 */

import { Loader2, Plus } from "lucide-react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import {
  LessonPlanCard,
  type LessonPlan,
} from "@/features/dashboard/components/lesson-plan-card"
import {
  useDeleteLessonPlan,
  useLessonPlans,
} from "@/features/generate/api/use-lesson-plans"
import type { LessonPlanSummary } from "@/features/generate/types"
import { useUser } from "@/lib/auth"

/** Map a backend summary to the presentational `LessonPlanCard` shape. */
function toCardPlan(summary: LessonPlanSummary): LessonPlan {
  return {
    id: summary.id,
    title: summary.title,
    subject: summary.learningAreas,
    quarter: summary.gradeLevelAndSection,
    // Fresh AI drafts always need teacher review before use.
    status: "GENERATED",
    progress: 0,
    progressLabel: "AI draft — needs review",
    updatedLabel: new Date(summary.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    placeholderCount: summary.placeholderCount,
  }
}

export default function Dashboard() {
  const user = useUser()
  const navigate = useNavigate()
  const { data, isLoading } = useLessonPlans()
  const deletePlan = useDeleteLessonPlan()

  const plans = data ?? []

  const openPlan = (id: string) => navigate(paths.app.planDetail.getHref(id))

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground text-balance">
            Welcome{user.data ? `, ${user.data.firstName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your lesson plans, drafts, and AI-generated reviews.
          </p>
        </div>
        <Button onClick={() => navigate(paths.app.generate.getHref())}>
          <Plus data-icon="inline-start" />
          New Lesson Plan
        </Button>
      </header>

      {isLoading ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="size-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your lesson plans…</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">No lesson plans yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Generate your first DepEd MATATAG-aligned lesson plan in minutes.
          </p>
          <Button onClick={() => navigate(paths.app.generate.getHref())}>
            <Plus data-icon="inline-start" />
            New Lesson Plan
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((summary) => (
            <LessonPlanCard
              key={summary.id}
              plan={toCardPlan(summary)}
              onEdit={openPlan}
              onDelete={(id) => deletePlan.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
