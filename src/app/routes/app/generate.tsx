/**
 * Generate New Lesson Plan — primary post-auth destination (`/generate`).
 *
 * A 3-step wizard (lesson details → competencies → review) that collects the
 * inputs for a DepEd MATATAG-aligned lesson plan. Owns the wizard state and,
 * on submit, simulates generation before returning to the dashboard. Rendered
 * standalone with its own <DashboardNav/> (no /app shell).
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
import { paths } from "@/config/paths"
import { WizardStepper } from "@/features/generate/components/wizard-stepper"
import {
  StepLessonDetails,
  type LessonDetailsData,
} from "@/features/generate/components/step-lesson-details"
import {
  StepCompetencies,
  type CompetenciesData,
} from "@/features/generate/components/step-competencies"
import { StepReview } from "@/features/generate/components/step-review"

const STEP_TITLES = [
  {
    title: "Lesson Details",
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
]

/**
 * Lesson-plan generation page.
 *
 * @returns The wizard UI; advances through three steps and, on generate,
 *   simulates an async draft then navigates to the dashboard.
 */
export default function GeneratePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const [details, setDetails] = useState<LessonDetailsData>({
    gradeLevel: "",
    learningArea: "",
    term: "",
    week: "",
    teacherName: "",
    section: "",
    sessions: 1,
  })

  const [competencies, setCompetencies] = useState<CompetenciesData>({
    competencies: [""],
    additionalInstructions: "",
  })

  // Simulate AI generation, then return to the dashboard.
  // TODO: replace the timeout with the real generation API call (POST /lesson-plans
  // or similar) and navigate to the generated draft once the backend exists.
  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      navigate(paths.app.dashboard.getHref())
    }, 3500)
  }

  const stepInfo = STEP_TITLES[step - 1]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
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
          </CardContent>
        </Card>

        {/* Step indicator for mobile */}
        <p className="mt-4 text-center text-xs text-muted-foreground sm:hidden">
          Step {step} of 3 — {stepInfo.title}
        </p>
      </main>
    </div>
  )
}
