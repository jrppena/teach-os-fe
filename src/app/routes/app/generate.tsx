/**
 * Generate New Lesson Plan — primary post-auth destination (`/generate`).
 *
 * A 4-step wizard (lesson information → competencies → review → result) that
 * collects inputs for a DepEd MATATAG / ILAW lesson plan, then renders the
 * generated plan as a per-session table. Owns the wizard state and, on submit,
 * runs the local mock generator. Rendered standalone with its own
 * <DashboardNav/> (no /app shell).
 */

import { useState } from "react"
import { useNavigate } from "react-router"

import { DashboardNav } from "@/components/layouts/dashboard-nav"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { paths } from "@/config/paths"
import { WizardStepper } from "@/features/generate/components/wizard-stepper"
import {
  StepLessonDetails,
  DEFAULT_AI_DECLARATION,
  type LessonDetailsData,
} from "@/features/generate/components/step-lesson-details"
import {
  StepCompetencies,
  type CompetenciesData,
} from "@/features/generate/components/step-competencies"
import { StepReview } from "@/features/generate/components/step-review"
import { StepResult } from "@/features/generate/components/step-result"
import { generateLessonPlan } from "@/features/generate/mock-generator"
import type { GeneratedLessonPlan } from "@/features/generate/types"

const STEP_TITLES = [
  {
    title: "Lesson Information",
    description:
      "Fill in the basic information for your lesson plan. Required fields are marked with *",
  },
  {
    title: "Learning Competencies",
    description: "Specify the MELC/competencies this lesson will address.",
  },
  {
    title: "Review & Generate",
    description:
      "Review your inputs, read the compliance notice, then generate your draft.",
  },
  {
    title: "Your ILAW Lesson Plan",
    description:
      "AI-generated draft with one column per session. Review and complete the highlighted fields.",
  },
]

/**
 * Lesson-plan generation page.
 *
 * @returns The wizard UI; advances through four steps and, on generate, runs the
 *   mock generator and shows the resulting ILAW lesson plan.
 */
export default function GeneratePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [plan, setPlan] = useState<GeneratedLessonPlan | null>(null)

  const [details, setDetails] = useState<LessonDetailsData>({
    lessonTitle: "",
    gradeLevel: "",
    learningArea: "",
    term: "",
    week: "",
    teacherName: "",
    section: "",
    sessions: 1,
    minutesPerSession: 45,
    references: [""],
    aiDeclaration: DEFAULT_AI_DECLARATION,
  })

  const [competencies, setCompetencies] = useState<CompetenciesData>({
    competencies: [""],
    additionalInstructions: "",
  })

  // Run the (mock) generator, then advance to the result step.
  // TODO: replace generateLessonPlan with the real API call (POST /lesson-plans)
  // once the backend exists; the GeneratedLessonPlan shape is meant to match it.
  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setPlan(generateLessonPlan(details, competencies))
      setIsGenerating(false)
      setStep(4)
    }, 1800)
  }

  const stepInfo = STEP_TITLES[step - 1]
  const isResult = step === 4

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main
        className={cn(
          "mx-auto px-4 py-10 sm:py-14",
          isResult ? "max-w-6xl" : "max-w-2xl",
        )}
      >
        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Generate New Lesson Plan
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Answer a few questions and ILAW will draft a DepEd MATATAG-aligned lesson plan for you.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <WizardStepper currentStep={step} />
        </div>

        {/* Active step card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              {stepInfo.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {stepInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <StepLessonDetails
                data={details}
                onChange={setDetails}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <StepCompetencies
                data={competencies}
                onChange={setCompetencies}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <StepReview
                details={details}
                competencies={competencies}
                onBack={() => setStep(2)}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
            {step === 4 && plan && (
              <StepResult
                plan={plan}
                onBackToDashboard={() => navigate(paths.app.dashboard.getHref())}
              />
            )}
          </CardContent>
        </Card>

        {/* Step indicator for mobile */}
        <p className="mt-4 text-center text-xs text-muted-foreground sm:hidden">
          Step {step} of 4 — {stepInfo.title}
        </p>
      </main>
    </div>
  )
}
