/**
 * Onboarding · School-info step.
 *
 * Second step of the guided setup wizard. Collects the teacher's DepEd school
 * header fields (school name, region, division, district, address) and saves
 * them via {@link useUpdateProfile} — the same hook the Settings page uses.
 * Pre-fills from the authenticated user. The teacher can save & continue or
 * skip for now (both advance the wizard); these fields are only needed for the
 * DOCX/PDF export header, so they are optional here.
 */

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateProfile } from "@/features/settings/api/use-update-profile"
import { useUser } from "@/lib/auth"

interface OnboardingSchoolStepProps {
  /** Advance to the next step (persists the onboarding pointer). */
  onNext: () => void
  /** Go back to the previous step (local only). */
  onBack: () => void
  /** True while the step pointer is being persisted by the wizard. */
  isAdvancing: boolean
}

/** The five editable school fields. */
interface SchoolDraft {
  schoolName: string
  region: string
  division: string
  district: string
  schoolAddress: string
}

/** Field metadata so the inputs render from a single list. */
const FIELDS: { key: keyof SchoolDraft; label: string; placeholder: string }[] = [
  { key: "schoolName", label: "School name", placeholder: "e.g. Goa Science High School" },
  { key: "schoolAddress", label: "School address", placeholder: "e.g. Tagongtong, Goa, Camarines Sur" },
  { key: "region", label: "Region", placeholder: "e.g. REGION V" },
  { key: "division", label: "Division", placeholder: "e.g. DIVISION OF CAMARINES SUR" },
  { key: "district", label: "District", placeholder: "e.g. Goa District" },
]

/**
 * School-info step UI.
 *
 * Inputs: reads the current user for pre-fill.
 * Outputs: on "Save & continue" it persists dirty fields then advances; "Skip"
 * advances without saving.
 * Side effects: triggers {@link useUpdateProfile} on save.
 *
 * @returns The school-info step form.
 */
export function OnboardingSchoolStep({
  onNext,
  onBack,
  isAdvancing,
}: OnboardingSchoolStepProps) {
  const user = useUser()
  const mutation = useUpdateProfile()

  const initial: SchoolDraft = {
    schoolName: user.data?.schoolName ?? "",
    region: user.data?.region ?? "",
    division: user.data?.division ?? "",
    district: user.data?.district ?? "",
    schoolAddress: user.data?.schoolAddress ?? "",
  }

  const [draft, setDraft] = useState<SchoolDraft>(initial)

  const isDirty = (Object.keys(initial) as (keyof SchoolDraft)[]).some(
    (k) => draft[k] !== initial[k],
  )

  const isBusy = mutation.isPending || isAdvancing

  const set = (key: keyof SchoolDraft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((prev) => ({ ...prev, [key]: e.target.value }))

  // Save only when something changed, then advance. If nothing changed, just advance.
  const handleContinue = () => {
    if (!isDirty) {
      onNext()
      return
    }
    mutation.mutate(draft, { onSuccess: () => onNext() })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Your school details</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          These appear in the DepEd header of your exported lesson plans. You can
          change them anytime in Settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={`onboarding-${field.key}`} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={`onboarding-${field.key}`}
              value={draft[field.key]}
              placeholder={field.placeholder}
              onChange={set(field.key)}
              disabled={isBusy}
              className="h-9 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isBusy}>
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onNext} disabled={isBusy}>
            Skip for now
          </Button>
          <Button type="button" onClick={handleContinue} disabled={isBusy}>
            {isBusy ? "Saving…" : "Save & continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
