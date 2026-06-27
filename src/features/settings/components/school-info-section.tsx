/**
 * Settings · School Information section.
 *
 * Lets a teacher fill in their DepEd school details (school name, region,
 * division, district, address). These values populate the school header block
 * in exported DOCX lesson plans and are stored on the backend ``user`` table
 * via ``PATCH /auth/user``.
 *
 * Data is pre-filled from the current authenticated user ({@link useUser}) and
 * saved via {@link useUpdateProfile}. Only fields the teacher has edited are
 * sent on save (all fields are optional in the PATCH body).
 */

import { useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUpdateProfile } from "@/features/settings/api/use-update-profile"
import { useUser } from "@/lib/auth"

/** The five editable school fields. */
interface SchoolDraft {
  schoolName: string
  region: string
  division: string
  district: string
  schoolAddress: string
}

/**
 * Editable form for the DepEd school header information.
 *
 * Pre-fills from the authenticated user's stored profile. Only dirty fields are
 * sent on save. Shows inline "saved" confirmation; no toast.
 *
 * @returns The school-info settings section UI.
 */
export function SchoolInfoSection() {
  const user = useUser()
  const mutation = useUpdateProfile()
  const [justSaved, setJustSaved] = useState(false)

  const initial: SchoolDraft = {
    schoolName: user.data?.schoolName ?? "",
    region: user.data?.region ?? "",
    division: user.data?.division ?? "",
    district: user.data?.district ?? "",
    schoolAddress: user.data?.schoolAddress ?? "",
  }

  const [draft, setDraft] = useState<SchoolDraft>(initial)

  const isDirty =
    draft.schoolName !== initial.schoolName ||
    draft.region !== initial.region ||
    draft.division !== initial.division ||
    draft.district !== initial.district ||
    draft.schoolAddress !== initial.schoolAddress

  const set = (key: keyof SchoolDraft) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, [key]: e.target.value }))
    setJustSaved(false)
  }

  const handleSave = () => {
    mutation.mutate(
      {
        schoolName: draft.schoolName,
        region: draft.region,
        division: draft.division,
        district: draft.district,
        schoolAddress: draft.schoolAddress,
      },
      {
        onSuccess: () => setJustSaved(true),
      },
    )
  }

  const isBusy = mutation.isPending

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="school-name" className="text-sm font-medium">
            School name
          </Label>
          <Input
            id="school-name"
            value={draft.schoolName}
            placeholder="e.g. Goa Science High School"
            onChange={set("schoolName")}
            disabled={isBusy}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="school-address" className="text-sm font-medium">
            School address
          </Label>
          <Input
            id="school-address"
            value={draft.schoolAddress}
            placeholder="e.g. Tagongtong, Goa, Camarines Sur"
            onChange={set("schoolAddress")}
            disabled={isBusy}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="region" className="text-sm font-medium">
            Region
          </Label>
          <Input
            id="region"
            value={draft.region}
            placeholder="e.g. REGION V"
            onChange={set("region")}
            disabled={isBusy}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="division" className="text-sm font-medium">
            Division
          </Label>
          <Input
            id="division"
            value={draft.division}
            placeholder="e.g. DIVISION OF CAMARINES SUR"
            onChange={set("division")}
            disabled={isBusy}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="district" className="text-sm font-medium">
            District
          </Label>
          <Input
            id="district"
            value={draft.district}
            placeholder="e.g. Goa District"
            onChange={set("district")}
            disabled={isBusy}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground" aria-live="polite" role="status">
          {isDirty ? (
            "You have unsaved changes."
          ) : justSaved ? (
            <span className="inline-flex items-center gap-1 text-foreground">
              <Check className="size-3.5" /> Changes saved
            </span>
          ) : (
            ""
          )}
        </p>
        <Button onClick={handleSave} disabled={!isDirty || isBusy}>
          {isBusy ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
