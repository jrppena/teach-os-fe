/**
 * Saved Lesson Plan detail (`/plans/:id`).
 *
 * Fetches one persisted plan by id and renders it with the same `StepResult`
 * view used at the end of the generate wizard, so a saved plan is read/edited
 * with the identical per-session table. Standalone layout (its own
 * <DashboardNav/>), matching the generate page.
 */

import { Loader2 } from "lucide-react"
import { useNavigate, useParams } from "react-router"

import { AppPageLayout } from "@/components/layouts/app-page-layout"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import { useLessonPlan } from "@/features/generate/api/use-lesson-plans"
import { StepResult } from "@/features/generate/components/step-result"

/**
 * Lesson-plan detail page.
 *
 * @returns A loading state, a not-found fallback, or the full `StepResult` view
 *   for the saved plan identified by the `:id` route param.
 */
export default function PlanDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useLessonPlan(id)

  const backToDashboard = () => navigate(paths.app.dashboard.getHref())

  return (
    <AppPageLayout>
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading lesson plan…</p>
          </div>
        )}

        {!isLoading && (isError || !data) && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium text-foreground">Lesson plan not found</p>
            <p className="text-sm text-muted-foreground">
              It may have been deleted, or you don’t have access to it.
            </p>
            <Button onClick={backToDashboard}>Back to Dashboard</Button>
          </div>
        )}

        {!isLoading && data && (
          <StepResult plan={data.plan} onBackToDashboard={backToDashboard} />
        )}
    </AppPageLayout>
  )
}
