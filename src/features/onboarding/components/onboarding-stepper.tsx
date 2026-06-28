// Step indicator for the first-time onboarding wizard.
// Renders the three-step progress bar (bubble + label + connector), mirroring
// the lesson-plan generator's WizardStepper styling.

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/** The three onboarding steps, in order. Index 0 → step 1. */
const ONBOARDING_STEP_LABELS = ["Welcome", "School info", "AI provider key"] as const

interface OnboardingStepperProps {
  /** 1-based index of the active step. */
  currentStep: number
}

/**
 * Horizontal stepper showing onboarding progress.
 *
 * @param currentStep - 1-based index of the active step; lower steps render as
 *   complete (check icon), the current step is highlighted, later steps muted.
 * @returns Accessible ordered list describing setup progress.
 */
export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  return (
    <nav aria-label="Setup progress" className="w-full">
      <ol className="flex items-center justify-center gap-0">
        {ONBOARDING_STEP_LABELS.map((label, idx) => {
          const number = idx + 1
          const isComplete = currentStep > number
          const isActive = currentStep === number
          const isLast = idx === ONBOARDING_STEP_LABELS.length - 1

          return (
            <li key={label} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isComplete || isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <span>{number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "hidden whitespace-nowrap text-xs font-medium sm:block",
                    isActive
                      ? "text-primary"
                      : isComplete
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "mx-2 h-px w-10 transition-colors sm:w-16",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
