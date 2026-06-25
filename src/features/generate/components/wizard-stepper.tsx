// Wizard step indicator for the lesson-plan generator.
// Renders the three-step progress bar (bubble + label + connector) used at the
// top of the /generate flow.

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface Step {
  number: number
  label: string
}

const STEPS: Step[] = [
  { number: 1, label: "Lesson Details" },
  { number: 2, label: "Learning Competencies" },
  { number: 3, label: "Review & Generate" },
]

interface WizardStepperProps {
  currentStep: number
}

/**
 * Horizontal stepper showing wizard progress.
 *
 * @param currentStep - 1-based index of the active step; lower steps render as
 *   complete (check icon), the current step is highlighted, later steps are muted.
 * @returns Accessible ordered list describing form progress.
 */
export function WizardStepper({ currentStep }: WizardStepperProps) {
  return (
    <nav aria-label="Form progress" className="w-full">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((step, idx) => {
          const isComplete = currentStep > step.number
          const isActive = currentStep === step.number
          const isLast = idx === STEPS.length - 1

          return (
            <li key={step.number} className="flex items-center">
              {/* Step bubble + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isComplete
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "hidden sm:block text-xs font-medium whitespace-nowrap",
                    isActive
                      ? "text-primary"
                      : isComplete
                        ? "text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "h-px w-16 sm:w-24 mx-2 transition-colors",
                    isComplete ? "bg-primary" : "bg-border"
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
