/**
 * Onboarding · Welcome step.
 *
 * The first step of the guided setup wizard: a short, friendly intro that orients
 * a brand-new teacher before the two setup steps (school info + AI key). No data
 * entry — just a "Get started" call to action that advances the wizard.
 */

import { FileText, KeyRound, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BRAND } from "@/config/branding"

interface OnboardingWelcomeStepProps {
  /** Name to greet the teacher with (their first name). */
  firstName?: string
  /** Advance to the next step (persists the onboarding pointer). */
  onNext: () => void
  /** True while the step pointer is being persisted. */
  isAdvancing: boolean
}

/** A single "what you'll set up" bullet. */
function SetupHint({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FileText
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </li>
  )
}

/**
 * Welcome step UI.
 *
 * @returns Intro copy, a short list of what onboarding will set up, and a
 *   "Get started" button.
 */
export function OnboardingWelcomeStep({
  firstName,
  onNext,
  isAdvancing,
}: OnboardingWelcomeStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-6" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Welcome to {BRAND.name}
            {firstName ? `, ${firstName}` : ""}!
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Let's get you set up to generate your first lesson plan. This takes
            about a minute.
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-4">
        <SetupHint icon={FileText} title="Your school details">
          Used to fill the DepEd header on your exported lesson plans.
        </SetupHint>
        <SetupHint icon={KeyRound} title="An AI provider key">
          Connect Gemini or Grok so {BRAND.name} can generate plans for you.
        </SetupHint>
      </ul>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={isAdvancing}>
          {isAdvancing ? "Starting…" : "Get started"}
        </Button>
      </div>
    </div>
  )
}
