/**
 * Onboarding · wizard.
 *
 * Orchestrates the guided first-time setup: WELCOME → SCHOOL_INFO → PROVIDER_KEY
 * → (COMPLETED). It owns the local step state (initialised from the user's
 * stored ``onboardingStep`` so the flow is resumable) and persists each forward
 * transition via {@link useUpdateOnboardingStep}. Each sub-step saves its own
 * data (school info / provider key) before calling back to advance. On
 * completion it marks the user COMPLETED and routes to the lesson-plan
 * generator.
 */

import { useState } from "react"
import { useNavigate } from "react-router"

import { paths } from "@/config/paths"
import { useUpdateOnboardingStep } from "@/features/onboarding/api/use-update-onboarding-step"
import { OnboardingKeyStep } from "@/features/onboarding/components/onboarding-key-step"
import { OnboardingSchoolStep } from "@/features/onboarding/components/onboarding-school-step"
import { OnboardingStepper } from "@/features/onboarding/components/onboarding-stepper"
import { OnboardingWelcomeStep } from "@/features/onboarding/components/onboarding-welcome-step"
import { useUser } from "@/lib/auth"
import type { OnboardingStep } from "@/types/api"

/** The three interactive steps, in order; COMPLETED is terminal (navigates away). */
const STEP_ORDER: Exclude<OnboardingStep, "COMPLETED">[] = [
  "WELCOME",
  "SCHOOL_INFO",
  "PROVIDER_KEY",
]

/**
 * Resolve the initial wizard step from the user's stored progress.
 * Anything outside the interactive set (e.g. COMPLETED) falls back to WELCOME —
 * the /onboarding route already redirects COMPLETED users away.
 */
function resolveInitialStep(
  stored: OnboardingStep | undefined,
): Exclude<OnboardingStep, "COMPLETED"> {
  return stored && stored !== "COMPLETED" ? stored : "WELCOME"
}

/**
 * The onboarding wizard.
 *
 * Inputs: reads the authenticated user (stored step + first name).
 * Outputs: advances/persists the onboarding pointer; navigates to /generate when
 * complete.
 * Side effects: triggers {@link useUpdateOnboardingStep}.
 *
 * @returns The stepper + the active step's form.
 */
export function OnboardingWizard() {
  const user = useUser()
  const navigate = useNavigate()
  const updateStep = useUpdateOnboardingStep()

  const [step, setStep] = useState<Exclude<OnboardingStep, "COMPLETED">>(() =>
    resolveInitialStep(user.data?.onboardingStep),
  )

  const currentIndex = STEP_ORDER.indexOf(step)

  // Persist the next step, then move there (or leave the wizard when complete).
  const advance = async (next: OnboardingStep) => {
    await updateStep.mutateAsync({ step: next })
    if (next === "COMPLETED") {
      navigate(paths.app.generate.getHref(), { replace: true })
    } else {
      setStep(next)
    }
  }

  const goBack = (prev: Exclude<OnboardingStep, "COMPLETED">) => setStep(prev)

  return (
    <div className="flex flex-col gap-8">
      <OnboardingStepper currentStep={currentIndex + 1} />

      {step === "WELCOME" && (
        <OnboardingWelcomeStep
          firstName={user.data?.firstName}
          onNext={() => advance("SCHOOL_INFO")}
          isAdvancing={updateStep.isPending}
        />
      )}

      {step === "SCHOOL_INFO" && (
        <OnboardingSchoolStep
          onNext={() => advance("PROVIDER_KEY")}
          onBack={() => goBack("WELCOME")}
          isAdvancing={updateStep.isPending}
        />
      )}

      {step === "PROVIDER_KEY" && (
        <OnboardingKeyStep
          onFinish={() => advance("COMPLETED")}
          onBack={() => goBack("SCHOOL_INFO")}
          isAdvancing={updateStep.isPending}
        />
      )}
    </div>
  )
}
