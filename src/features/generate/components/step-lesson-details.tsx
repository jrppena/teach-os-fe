// Step 1 of the lesson-plan generator: basic lesson details.
// Captures grade level, learning area, term, week, optional teacher/section, and
// the number of sessions, then gates the "Next" action on the required fields.

import { Minus, Plus } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export interface LessonDetailsData {
  gradeLevel: string
  learningArea: string
  term: string
  week: string
  teacherName: string
  section: string
  sessions: number
}

interface StepLessonDetailsProps {
  data: LessonDetailsData
  onChange: (data: LessonDetailsData) => void
  onNext: () => void
}

const GRADE_OPTIONS = [
  "Grade 7", "Grade 8", "Grade 9",
  "Grade 10", "Grade 11", "Grade 12",
]

const LEARNING_AREAS = [
  "Araling Panlipunan",
  "Earth Science",
  "English",
  "Filipino",
  "Finite Mathematics",
  "General Mathematics",
  "Physical Education & Health",
  "Practical Research 1",
  "Practical Research 2",
  "Science",
  "Technology & Livelihood Education (TLE)",
  "Values Education (EsP)",
]

const TERM_OPTIONS = [
  "Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4",
  "1st Semester", "2nd Semester",
]

const WEEK_OPTIONS = Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`)

/**
 * Lesson-details form (wizard step 1).
 *
 * @param data - Current lesson-details values (controlled by the parent).
 * @param onChange - Called with the next data object on any field change.
 * @param onNext - Advances the wizard; disabled until grade/area/term/week are set.
 * @returns A grid of selects/inputs plus a sessions stepper and a Next button.
 */
export function StepLessonDetails({ data, onChange, onNext }: StepLessonDetailsProps) {
  const set = <K extends keyof LessonDetailsData>(key: K, value: LessonDetailsData[K]) =>
    onChange({ ...data, [key]: value })

  const isValid = !!data.gradeLevel && !!data.learningArea && !!data.term && !!data.week

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Grade Level */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gradeLevel">
            Grade Level <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Select value={data.gradeLevel} onValueChange={(v) => set("gradeLevel", v)}>
            <SelectTrigger id="gradeLevel" aria-required="true">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {GRADE_OPTIONS.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Learning Area */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="learningArea">
            Learning Area <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Select value={data.learningArea} onValueChange={(v) => set("learningArea", v)}>
            <SelectTrigger id="learningArea" aria-required="true">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {LEARNING_AREAS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Term */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="term">
            Term / Quarter <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Select value={data.term} onValueChange={(v) => set("term", v)}>
            <SelectTrigger id="term" aria-required="true">
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
            <SelectTrigger id="week" aria-required="true">
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
            Teacher Name <span className="text-xs text-muted-foreground font-normal">(optional)</span>
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

      {/* Sessions stepper */}
      <div className="flex flex-col gap-1.5">
        <Label>
          Number of Sessions <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <p className="text-xs text-muted-foreground -mt-0.5">
          How many 60-minute sessions will this lesson cover?
        </p>
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
          <span className="text-sm text-muted-foreground">session{data.sessions !== 1 ? "s" : ""}</span>
        </div>
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
