// Step 1 of the lesson-plan generator: Lesson Information.
// Captures the ILAW "Lesson Information" block — lesson title, subject,
// teacher, grade level & section, number/length of sessions, references, and the
// Declaration of AI Use — then gates "Next" on the required fields.

import { Minus, Plus, X } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  useGradeLevels,
  useSubjects,
} from "@/features/generate/api/use-curriculum"
import type { Subject } from "@/features/generate/types"

export interface LessonDetailsData {
  lessonTitle: string
  gradeLevel: string
  learningArea: string
  term: string
  week: string
  teacherName: string
  section: string
  sessions: number
  minutesPerSession: number
  references: string[]
  aiDeclaration: string
}

interface StepLessonDetailsProps {
  data: LessonDetailsData
  onChange: (data: LessonDetailsData) => void
  onNext: () => void
}

const TERM_OPTIONS = [
  "Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4",
  "1st Semester", "2nd Semester",
]

const WEEK_OPTIONS = Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`)

const MINUTES_OPTIONS = [30, 40, 45, 50, 60, 80, 90, 120]

/** Canonical Declaration of AI Use, pre-filled and editable (DO 003 / DO 16, s.2026). */
export const DEFAULT_AI_DECLARATION =
  "I declare that Artificial Intelligence was utilized to assist in the structural " +
  "drafting of this lesson plan, in strict adherence to DO 003 s. 2026 Annex A & " +
  "DO 16 s. 2026 Sec. 25, with full human oversight applied to ensure pedagogical " +
  "accuracy and appropriateness."

/**
 * Lesson-information form (wizard step 1).
 *
 * @param data - Current lesson-information values (controlled by the parent).
 * @param onChange - Called with the next data object on any field change.
 * @param onNext - Advances the wizard; disabled until title/grade/area/term/week are set.
 * @returns The lesson-information fields plus a session stepper and a Next button.
 */
export function StepLessonDetails({ data, onChange, onNext }: StepLessonDetailsProps) {
  const set = <K extends keyof LessonDetailsData>(key: K, value: LessonDetailsData[K]) =>
    onChange({ ...data, [key]: value })

  // Curriculum reference data (DB-backed). The subject list depends on the
  // selected grade — resolve the grade's code from its display name to fetch it.
  const { data: gradeLevels = [], isLoading: gradesLoading } = useGradeLevels()
  const selectedGrade = gradeLevels.find((g) => g.name === data.gradeLevel)
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects(
    selectedGrade?.code,
  )

  // Separate core subjects from electives; group electives by track → cluster.
  const coreSubjects = subjects.filter((s) => s.cluster === null)
  const electroSubjects = subjects.filter((s) => s.cluster !== null)

  // Build an ordered map: track → cluster-name → subjects.
  // We preserve the cluster order_index ordering that the API already applies.
  const clusterMap = new Map<string, { track: string; subjects: Subject[] }>()
  for (const subject of electroSubjects) {
    const clusterName = subject.cluster!.name
    if (!clusterMap.has(clusterName)) {
      clusterMap.set(clusterName, { track: subject.cluster!.track, subjects: [] })
    }
    clusterMap.get(clusterName)!.subjects.push(subject)
  }

  // Track-level groups in display order: Academic first, then TechPro.
  const academicClusters = [...clusterMap.entries()].filter(
    ([, v]) => v.track === "ACADEMIC",
  )
  const techProClusters = [...clusterMap.entries()].filter(
    ([, v]) => v.track === "TECHPRO",
  )
  const hasClusters = clusterMap.size > 0

  // Changing the grade clears the chosen subject, since subjects differ per grade.
  const onGradeChange = (gradeName: string) =>
    onChange({ ...data, gradeLevel: gradeName, learningArea: "" })

  const setReference = (index: number, value: string) => {
    const updated = [...data.references]
    updated[index] = value
    set("references", updated)
  }

  const removeReference = (index: number) => {
    const updated = data.references.filter((_, i) => i !== index)
    set("references", updated.length > 0 ? updated : [""])
  }

  const addReference = () => set("references", [...data.references, ""])

  const isValid =
    !!data.lessonTitle.trim() &&
    !!data.gradeLevel &&
    !!data.learningArea &&
    !!data.term &&
    !!data.week

  return (
    <div className="flex flex-col gap-6">
      {/* Lesson Title */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lessonTitle">
          Lesson Title <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Input
          id="lessonTitle"
          placeholder="e.g. Introduction to Matrices and Matrix Operations"
          value={data.lessonTitle}
          onChange={(e) => set("lessonTitle", e.target.value)}
          aria-required="true"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Grade Level */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gradeLevel">
            Grade Level <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Select
            value={data.gradeLevel}
            onValueChange={onGradeChange}
            disabled={gradesLoading}
          >
            <SelectTrigger id="gradeLevel" className="w-full" aria-required="true">
              <SelectValue placeholder={gradesLoading ? "Loading grades…" : "Select grade"} />
            </SelectTrigger>
            <SelectContent>
              {gradeLevels.map((g) => (
                <SelectItem key={g.code} value={g.name}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="learningArea">
            Subject <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Select
            value={data.learningArea}
            onValueChange={(v) => set("learningArea", v)}
            disabled={!selectedGrade || subjectsLoading}
          >
            <SelectTrigger id="learningArea" className="w-full" aria-required="true">
              <SelectValue
                placeholder={
                  !selectedGrade
                    ? "Select grade first"
                    : subjectsLoading
                      ? "Loading subjects…"
                      : "Select subject"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {hasClusters ? (
                <>
                  {/* Core subjects (no cluster) */}
                  {coreSubjects.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Core Subjects</SelectLabel>
                      {coreSubjects.map((s) => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}

                  {/* Academic track clusters */}
                  {academicClusters.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Academic Track</SelectLabel>
                      {academicClusters.map(([clusterName, { subjects: clusterSubjects }]) => (
                        <SelectGroup key={clusterName}>
                          <SelectLabel className="pl-4 text-xs font-normal italic text-muted-foreground">
                            {clusterName}
                          </SelectLabel>
                          {clusterSubjects.map((s) => (
                            <SelectItem key={s.id} value={s.name} className="pl-6">
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectGroup>
                  )}

                  {/* Technical-Professional track clusters */}
                  {techProClusters.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Technical-Professional Track</SelectLabel>
                      {techProClusters.map(([clusterName, { subjects: clusterSubjects }]) => (
                        <SelectGroup key={clusterName}>
                          <SelectLabel className="pl-4 text-xs font-normal italic text-muted-foreground">
                            {clusterName}
                          </SelectLabel>
                          {clusterSubjects.map((s) => (
                            <SelectItem key={s.id} value={s.name} className="pl-6">
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectGroup>
                  )}
                </>
              ) : (
                /* K-10: flat subject list */
                subjects.map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Term */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="term">
            Term / Quarter <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Select value={data.term} onValueChange={(v) => set("term", v)}>
            <SelectTrigger id="term" className="w-full" aria-required="true">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              {TERM_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Week */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="week">
            Week <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Select value={data.week} onValueChange={(v) => set("week", v)}>
            <SelectTrigger id="week" className="w-full" aria-required="true">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {WEEK_OPTIONS.map((w) => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Teacher Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="teacherName">
            Name of Teacher/s <span className="text-xs text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="teacherName"
            placeholder="e.g. Maria Santos"
            value={data.teacherName}
            onChange={(e) => set("teacherName", e.target.value)}
          />
        </div>

        {/* Section */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="section">
            Section <span className="text-xs text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="section"
            placeholder="e.g. 7-Mabini, IV-Rizal"
            value={data.section}
            onChange={(e) => set("section", e.target.value)}
          />
        </div>
      </div>

      {/* Sessions + minutes per session */}
      <div className="flex flex-col gap-1.5">
        <Label>
          Number of Sessions <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <p className="text-xs text-muted-foreground -mt-0.5">
          The lesson plan output will have one column per session.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="size-8 p-0"
              disabled={data.sessions <= 1}
              onClick={() => set("sessions", data.sessions - 1)}
              aria-label="Decrease sessions"
            >
              <Minus className="size-3.5" />
            </Button>
            <span
              className="w-8 text-center text-base font-semibold tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {data.sessions}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="size-8 p-0"
              disabled={data.sessions >= 5}
              onClick={() => set("sessions", data.sessions + 1)}
              aria-label="Increase sessions"
            >
              <Plus className="size-3.5" />
            </Button>
            <span className="text-sm text-muted-foreground">
              session{data.sessions !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Minutes per session */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">at</span>
            <Select
              value={String(data.minutesPerSession)}
              onValueChange={(v) => set("minutesPerSession", Number(v))}
            >
              <SelectTrigger className="w-[110px]" aria-label="Minutes per session">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MINUTES_OPTIONS.map((m) => (
                  <SelectItem key={m} value={String(m)}>{m} min</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">each</span>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="flex flex-col gap-2">
        <Label>
          References <span className="text-xs text-muted-foreground font-normal">(optional)</span>
        </Label>
        <p className="text-xs text-muted-foreground -mt-0.5">
          Books, websites, toolkits, etc. used to build this lesson.
        </p>
        <div className="flex flex-col gap-2 mt-1" role="list" aria-label="References">
          {data.references.map((reference, idx) => (
            <div key={idx} role="listitem" className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground tabular-nums w-5 text-right shrink-0">
                {idx + 1}.
              </span>
              <Input
                value={reference}
                onChange={(e) => setReference(idx, e.target.value)}
                placeholder="e.g. LibreTexts: 2.1 Introduction to Matrices"
                aria-label={`Reference ${idx + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                  data.references.length === 1 && "opacity-40 pointer-events-none",
                )}
                onClick={() => removeReference(idx)}
                disabled={data.references.length === 1}
                aria-label={`Remove reference ${idx + 1}`}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addReference}
          className={cn(
            "mt-1 flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-border",
            "py-2.5 text-sm font-medium text-muted-foreground",
            "hover:border-primary/60 hover:text-primary hover:bg-primary/5",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          aria-label="Add another reference"
        >
          <span className="text-base leading-none">+</span>
          Add Reference
        </button>
      </div>

      {/* Declaration of AI Use */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="aiDeclaration">
          Declaration of AI Use <span className="text-xs text-muted-foreground font-normal">(per DO 003 / DO 16, s. 2026)</span>
        </Label>
        <Textarea
          id="aiDeclaration"
          value={data.aiDeclaration}
          onChange={(e) => set("aiDeclaration", e.target.value)}
          className="min-h-[96px] resize-y text-sm"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Pre-filled with the standard declaration — edit if your school requires different wording.
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={!isValid}>
          Next: Learning Competencies
        </Button>
      </div>
    </div>
  )
}
