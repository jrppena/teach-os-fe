/**
 * Dashboard — index route of the authenticated app (`/app`).
 *
 * Greets the signed-in user and lists their lesson plans as a responsive
 * card grid. No lesson-plan API exists yet, so this renders representative
 * sample data; swap `SAMPLE_PLANS` for a real query when the endpoint lands.
 */

import { Plus } from "lucide-react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import {
  LessonPlanCard,
  type LessonPlan,
} from "@/features/dashboard/components/lesson-plan-card"
import { useUser } from "@/lib/auth"

// Placeholder data until a lesson-plan endpoint is wired up.
const SAMPLE_PLANS: LessonPlan[] = [
  {
    id: "1",
    title: "Figures of Speech in Literary Texts",
    subject: "English 9",
    quarter: "Q3 · Week 2",
    status: "GENERATED",
    progress: 72,
    progressLabel: "72% complete",
    updatedLabel: "2 days ago",
    placeholderCount: 3,
  },
  {
    id: "2",
    title: "Solving Systems of Linear Equations",
    subject: "Mathematics 9",
    quarter: "Q1 · Week 5",
    status: "COMPLETED",
    progress: 100,
    progressLabel: "Finalized",
    updatedLabel: "15 days ago",
    placeholderCount: 0,
  },
  {
    id: "3",
    title: "Aralin sa Kasaysayan ng Pilipinas",
    subject: "Araling Panlipunan 9",
    quarter: "Q2 · Week 1",
    status: "DRAFT",
    progress: 20,
    progressLabel: "20% complete",
    updatedLabel: "Today",
    placeholderCount: 0,
  },
]

export default function Dashboard() {
  const user = useUser()
  const navigate = useNavigate()
  const plans = SAMPLE_PLANS

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

      {plans.length === 0 ? (
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
          {plans.map((plan) => (
            <LessonPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  )
}
