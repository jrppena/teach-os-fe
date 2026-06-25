// Step 2 of the lesson-plan generator: learning competencies.
// Manages a dynamic list of MELC/competency inputs plus optional free-text
// instructions, requiring at least one non-empty competency to proceed.

import { useRef } from "react"
import { X } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CompetenciesData {
  competencies: string[]
  additionalInstructions: string
}

interface StepCompetenciesProps {
  data: CompetenciesData
  onChange: (data: CompetenciesData) => void
  onBack: () => void
  onNext: () => void
}

/**
 * Learning-competencies form (wizard step 2).
 *
 * @param data - Current competencies list + additional instructions (controlled).
 * @param onChange - Called with the next data object on any change.
 * @param onBack - Returns to step 1.
 * @param onNext - Advances to review; disabled until ≥1 competency has text.
 * @returns A dynamic competency list (add/remove/focus) and instructions field.
 */
export function StepCompetencies({ data, onChange, onBack, onNext }: StepCompetenciesProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const set = <K extends keyof CompetenciesData>(key: K, value: CompetenciesData[K]) =>
    onChange({ ...data, [key]: value })

  const handleCompetencyChange = (index: number, value: string) => {
    const updated = [...data.competencies]
    updated[index] = value
    set("competencies", updated)
  }

  const handleRemove = (index: number) => {
    const updated = data.competencies.filter((_, i) => i !== index)
    set("competencies", updated.length > 0 ? updated : [""])
  }

  const handleAdd = () => {
    set("competencies", [...data.competencies, ""])
    // Focus the new input on next tick
    setTimeout(() => {
      inputRefs.current[data.competencies.length]?.focus()
    }, 50)
  }

  const isValid = data.competencies.some((c) => c.trim().length > 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Competencies list */}
      <div className="flex flex-col gap-2">
        <Label>
          Learning Competencies <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <p className="text-xs text-muted-foreground -mt-0.5">
          Enter at least one Most Essential Learning Competency (MELC) this lesson targets.
        </p>

        <div
          className="flex flex-col gap-2 mt-1"
          role="list"
          aria-label="Learning competencies"
        >
          {data.competencies.map((competency, idx) => (
            <div
              key={idx}
              role="listitem"
              className="flex items-center gap-2"
            >
              <span className="text-xs text-muted-foreground tabular-nums w-5 text-right shrink-0">
                {idx + 1}.
              </span>
              <Input
                ref={(el) => { inputRefs.current[idx] = el }}
                value={competency}
                onChange={(e) => handleCompetencyChange(idx, e.target.value)}
                placeholder={`e.g. The learner identifies${idx === 0 ? " types of functions..." : "..."}`}
                aria-label={`Competency ${idx + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                  data.competencies.length === 1 && "opacity-40 pointer-events-none"
                )}
                onClick={() => handleRemove(idx)}
                disabled={data.competencies.length === 1}
                aria-label={`Remove competency ${idx + 1}`}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add button — dashed outline style */}
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "mt-1 flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-border",
            "py-2.5 text-sm font-medium text-muted-foreground",
            "hover:border-primary/60 hover:text-primary hover:bg-primary/5",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Add another competency"
        >
          <span className="text-base leading-none">+</span>
          Add Competency
        </button>
      </div>

      {/* Additional Instructions */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="additionalInstructions">
          Additional Instructions <span className="text-xs text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="additionalInstructions"
          value={data.additionalInstructions}
          onChange={(e) => set("additionalInstructions", e.target.value)}
          placeholder="Any specific focus, materials, or teaching strategy you'd like the AI to consider..."
          className="min-h-[120px] resize-y text-sm"
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          Examples: "Use Socratic questioning," "Include 4A's approach," "Align with STEM strand."
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Next: Review & Generate
        </Button>
      </div>
    </div>
  )
}
