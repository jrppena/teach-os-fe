// Step 3 of the lesson-plan generator: review & generate.
// Summarizes the collected inputs, shows the DepEd compliance notice, gates
// generation on an agreement checkbox, and renders a loading state while the
// (currently simulated) draft is produced.

import { useState } from "react"
import type { ReactNode } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { LessonDetailsData } from "./step-lesson-details"
import type { CompetenciesData } from "./step-competencies"

interface StepReviewProps {
  details: LessonDetailsData
  competencies: CompetenciesData
  onBack: () => void
  onGenerate: () => void
  isGenerating: boolean
  /**
   * When present, generation is blocked (e.g. the active AI provider has no key):
   * the node is rendered as an amber notice and the Generate button is disabled.
   */
  blockedNotice?: ReactNode
}

interface SummaryRowProps {
  label: string
  value: string | ReactNode
}

/** Single label/value row in the review summary list. */
function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-0.5 py-2">
      <dt className="text-sm text-muted-foreground font-medium">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}

/**
 * Review-and-generate form (wizard step 3).
 *
 * @param details - Collected lesson details (step 1).
 * @param competencies - Collected competencies + instructions (step 2).
 * @param onBack - Returns to step 2.
 * @param onGenerate - Triggers generation; gated on the compliance checkbox.
 * @param isGenerating - When true, replaces the form with a loading state.
 * @returns A read-only summary, compliance notice, agreement gate, and actions.
 */
export function StepReview({
  details,
  competencies,
  onBack,
  onGenerate,
  isGenerating,
  blockedNotice,
}: StepReviewProps) {
  const [agreed, setAgreed] = useState(false)

  const filledCompetencies = competencies.competencies.filter((c) => c.trim().length > 0)

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-semibold text-foreground">Generating your lesson plan...</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            The AI is drafting your DepEd MATATAG-aligned lesson plan. This may take up to 30 seconds.
          </p>
        </div>
        <div className="w-full max-w-xs mt-2">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[progress_2.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary card */}
      <section aria-labelledby="summary-heading">
        <h2
          id="summary-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
        >
          Lesson Information
        </h2>
        <div className="rounded-lg border border-border bg-muted/30 px-4">
          <dl>
            <SummaryRow label="Lesson Title" value={details.lessonTitle} />
            <Separator />
            <SummaryRow label="Grade Level" value={details.gradeLevel} />
            <Separator />
            <SummaryRow label="Learning Area" value={details.learningArea} />
            <Separator />
            <SummaryRow label="Term / Quarter" value={details.term} />
            <Separator />
            <SummaryRow label="Week" value={details.week} />
            <Separator />
            <SummaryRow
              label="Sessions"
              value={`${details.sessions} session${details.sessions !== 1 ? "s" : ""} (${details.minutesPerSession} min each)`}
            />
            {details.teacherName && (
              <>
                <Separator />
                <SummaryRow label="Teacher" value={details.teacherName} />
              </>
            )}
            {details.section && (
              <>
                <Separator />
                <SummaryRow label="Section" value={details.section} />
              </>
            )}
            {details.references.some((r) => r.trim()) && (
              <>
                <Separator />
                <SummaryRow
                  label="References"
                  value={
                    <ul className="list-disc list-inside space-y-0.5">
                      {details.references
                        .filter((r) => r.trim())
                        .map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                    </ul>
                  }
                />
              </>
            )}
            {details.aiDeclaration.trim() && (
              <>
                <Separator />
                <SummaryRow label="AI Use Declaration" value={details.aiDeclaration} />
              </>
            )}
          </dl>
        </div>
      </section>

      {/* Competencies */}
      <section aria-labelledby="competencies-heading">
        <h2
          id="competencies-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
        >
          Learning Competencies
        </h2>
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <ol className="flex flex-col gap-1.5 list-decimal list-inside">
            {filledCompetencies.map((c, i) => (
              <li key={i} className="text-sm text-foreground">
                {c}
              </li>
            ))}
          </ol>
          {competencies.additionalInstructions.trim() && (
            <>
              <Separator className="my-3" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Additional Instructions</p>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {competencies.additionalInstructions}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Compliance notice — amber "needs attention" accent (design-system.md) */}
      <aside
        className="rounded-lg border border-accent/40 bg-accent/15 px-4 py-4"
        aria-label="Compliance notice"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="size-5 text-accent-foreground mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-accent-foreground">
              Compliance Notice — AI-Generated Draft
            </p>
            <p className="text-sm text-accent-foreground/90 leading-relaxed">
              This tool produces an <strong>AI-generated draft</strong> that must be reviewed,
              completed, and adapted by the teacher before classroom use, in accordance with{" "}
              <strong>DepEd Order No. 16, s. 2026</strong> and{" "}
              <strong>DO No. 003, s. 2026</strong>. Teachers bear full professional responsibility
              for the final lesson plan submitted.
            </p>
            <p className="text-sm text-accent-foreground/80 leading-relaxed">
              Note: The legacy DLL/DLP format remains acceptable until the end of{" "}
              <strong>Term 1, SY 2026–2027</strong>. Schools transitioning to the MATATAG format
              may continue using existing templates during this period.
            </p>
          </div>
        </div>
      </aside>

      {/* Agreement checkbox */}
      <div className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
        <Checkbox
          id="compliance-agree"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
          className="mt-0.5"
          aria-required="true"
        />
        <Label
          htmlFor="compliance-agree"
          className="text-sm text-foreground leading-relaxed cursor-pointer"
        >
          I understand this generates a <strong>draft</strong> that I must review, complete, and
          adapt before use. I take professional responsibility for the final lesson plan.
        </Label>
      </div>

      {/* Provider-not-configured notice (amber "needs attention") */}
      {blockedNotice && (
        <aside
          className="rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 text-sm text-accent-foreground"
          role="status"
        >
          {blockedNotice}
        </aside>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onGenerate}
          disabled={!agreed || !!blockedNotice}
          className={cn(
            "gap-2",
            (!agreed || !!blockedNotice) && "opacity-50 cursor-not-allowed"
          )}
        >
          Generate Lesson Plan
        </Button>
      </div>
    </div>
  )
}
