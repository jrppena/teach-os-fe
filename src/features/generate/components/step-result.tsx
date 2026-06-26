// Step 4 of the lesson-plan generator: the generated ILAW lesson plan.
// Renders the DepEd MATATAG / ILAW lesson plan as a DLL-style table — a left
// guidance/label column plus one column per session — with lesson-wide rows
// (Lesson Information, Learning Competency, Learner Context) spanning full width.
// An "Edit" toggle turns every cell into a controlled input so the teacher can
// complete and adapt the AI-generated draft before exporting.

import { useState } from "react"
import type { ReactNode } from "react"
import { Check, Download, FileText, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  ROW_GUIDANCE,
  TEACHER_TODO_PREFIX,
  type FlowStep,
  type GeneratedLessonPlan,
  type SessionObjective,
} from "../types"

interface StepResultProps {
  plan: GeneratedLessonPlan
  onBackToDashboard: () => void
}

/** True when a cell's text is a teacher-to-complete placeholder (rendered amber). */
const isTeacherTodo = (text: string) => text.trimStart().startsWith(TEACHER_TODO_PREFIX)

/** Shared cell padding/typography for the lesson-plan table. */
const CELL = "border border-border p-3 align-top text-xs leading-relaxed text-foreground"

/** Immutably replace index `i` of an array. */
function setIn<T>(arr: T[], i: number, value: T): T[] {
  const copy = arr.slice()
  copy[i] = value
  return copy
}

/**
 * Generated ILAW lesson-plan view (wizard step 4).
 *
 * @param plan - The generated lesson plan; per-session arrays size the columns.
 * @param onBackToDashboard - Returns the user to the dashboard.
 * @returns The lesson-plan document (read-only or editable) with one column per session.
 */
export function StepResult({ plan, onBackToDashboard }: StepResultProps) {
  const [draft, setDraft] = useState<GeneratedLessonPlan>(plan)
  const [editing, setEditing] = useState(false)

  const sessionCount = draft.sessionLabels.length
  const info = draft.lessonInformation

  // ── Immutable update helpers ───────────────────────────────────────────────
  const updateInfo = (patch: Partial<GeneratedLessonPlan["lessonInformation"]>) =>
    setDraft((d) => ({ ...d, lessonInformation: { ...d.lessonInformation, ...patch } }))

  const updateSig = (patch: Partial<GeneratedLessonPlan["signatories"]>) =>
    setDraft((d) => ({ ...d, signatories: { ...d.signatories, ...patch } }))

  /** Update a per-session string field (preLesson, formativeAssessment, …). */
  const setSessionText = (
    key: "preLesson" | "formativeAssessment" | "extendedLearningOpportunities" | "reflections",
    i: number,
    value: string,
  ) => setDraft((d) => ({ ...d, [key]: setIn(d[key], i, value) }))

  /** Update a per-session list field, edited as one item per line. */
  const setSessionList = (
    key: "learningResources" | "opportunitiesForIntegration",
    i: number,
    value: string,
  ) => setDraft((d) => ({ ...d, [key]: setIn(d[key], i, value.split("\n")) }))

  const setObjective = (i: number, j: number, field: keyof SessionObjective, value: string) =>
    setDraft((d) => ({
      ...d,
      learningObjectives: setIn(
        d.learningObjectives,
        i,
        setIn(d.learningObjectives[i], j, { ...d.learningObjectives[i][j], [field]: value }),
      ),
    }))

  const setFlowStep = (i: number, j: number, field: keyof FlowStep, value: string) =>
    setDraft((d) => ({
      ...d,
      flow: setIn(d.flow, i, setIn(d.flow[i], j, { ...d.flow[i][j], [field]: value })),
    }))

  return (
    <div className="flex flex-col gap-5">
      {/* Header + actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold">
              {editing ? "EDITING" : "GENERATED"}
            </Badge>
            <span className="text-xs text-muted-foreground">ILAW Lesson Plan</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground text-balance">{info.title}</h2>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {editing ? (
            <Button size="sm" onClick={() => setEditing(false)}>
              <Check data-icon="inline-start" />
              Done editing
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil data-icon="inline-start" />
              Edit
            </Button>
          )}
          <Button variant="outline" size="sm" disabled title="Export coming soon">
            <FileText data-icon="inline-start" />
            Export DOCX
          </Button>
          <Button variant="outline" size="sm" disabled title="Export coming soon">
            <Download data-icon="inline-start" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Lesson Information (full-width block) */}
      <section aria-labelledby="lesson-info-heading">
        <SectionHeading id="lesson-info-heading">Lesson Information</SectionHeading>
        <div className="overflow-hidden rounded-lg border border-border">
          <dl className="divide-y divide-border text-sm">
            <InfoRow
              label="Lesson Title"
              value={
                editing ? (
                  <Editable singleLine value={info.title} onChange={(v) => updateInfo({ title: v })} />
                ) : (
                  info.title
                )
              }
            />
            <InfoRow
              label="Learning Area/s"
              value={
                editing ? (
                  <Editable singleLine value={info.learningAreas} onChange={(v) => updateInfo({ learningAreas: v })} />
                ) : (
                  info.learningAreas
                )
              }
            />
            <InfoRow
              label="Name of Teacher/s"
              value={
                editing ? (
                  <Editable singleLine value={info.teacherName} onChange={(v) => updateInfo({ teacherName: v })} />
                ) : (
                  info.teacherName
                )
              }
            />
            <InfoRow
              label="Grade Level & Section"
              value={
                editing ? (
                  <Editable
                    singleLine
                    value={info.gradeLevelAndSection}
                    onChange={(v) => updateInfo({ gradeLevelAndSection: v })}
                  />
                ) : (
                  info.gradeLevelAndSection
                )
              }
            />
            <InfoRow
              label="No. of Sessions"
              value={
                editing ? (
                  <Editable singleLine value={info.sessionsLabel} onChange={(v) => updateInfo({ sessionsLabel: v })} />
                ) : (
                  info.sessionsLabel
                )
              }
            />
            <InfoRow
              label="References"
              value={
                editing ? (
                  <Editable
                    rows={3}
                    value={info.references.join("\n")}
                    onChange={(v) => updateInfo({ references: v.split("\n") })}
                  />
                ) : info.references.length > 0 ? (
                  <ul className="list-disc list-inside space-y-0.5">
                    {info.references.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )
              }
            />
            <InfoRow
              label="Declaration of AI Use"
              value={
                editing ? (
                  <Editable rows={3} value={info.aiDeclaration} onChange={(v) => updateInfo({ aiDeclaration: v })} />
                ) : (
                  info.aiDeclaration
                )
              }
            />
          </dl>
        </div>
      </section>

      {/* The ILAW table (one column per session) */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse">
          <colgroup>
            <col className="w-[200px]" />
            {draft.sessionLabels.map((_, i) => (
              <col key={i} className="min-w-[220px]" />
            ))}
          </colgroup>

          <thead>
            <tr>
              <th className="border border-border bg-primary p-3 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                Lesson Component
              </th>
              {draft.sessionLabels.map((label) => (
                <th
                  key={label}
                  className="border border-border bg-primary p-3 text-left text-xs font-semibold uppercase tracking-wide text-primary-foreground"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* I — INTENTIONS */}
            <SectionBand letter="I" title="Intentions" span={sessionCount + 1} />
            <FullWidthRow label="Learning Competency" guidance={ROW_GUIDANCE.learningCompetency} span={sessionCount}>
              {editing ? (
                <Editable
                  rows={3}
                  value={draft.learningCompetency.join("\n")}
                  onChange={(v) => setDraft((d) => ({ ...d, learningCompetency: v.split("\n") }))}
                />
              ) : (
                <ol className="list-decimal list-inside space-y-1">
                  {draft.learningCompetency.map((c, i) => (
                    <li key={i} className={isTeacherTodo(c) ? "text-accent-foreground" : undefined}>
                      {c}
                    </li>
                  ))}
                </ol>
              )}
            </FullWidthRow>
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Learning Objectives"
              guidance={ROW_GUIDANCE.learningObjectives}
              render={(i) =>
                editing ? (
                  <div className="flex flex-col gap-3">
                    {draft.learningObjectives[i].map((obj, j) => (
                      <div key={j} className="flex flex-col gap-1.5">
                        <Editable rows={2} value={obj.knowledge} onChange={(v) => setObjective(i, j, "knowledge", v)} placeholder="Knowledge" />
                        <Editable rows={2} value={obj.skill} onChange={(v) => setObjective(i, j, "skill", v)} placeholder="Skill" />
                        <Editable rows={2} value={obj.task} onChange={(v) => setObjective(i, j, "task", v)} placeholder="Task" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {draft.learningObjectives[i].map((obj, j) => (
                      <li key={j} className="flex gap-2">
                        <span
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                          aria-hidden="true"
                        >
                          {j + 1}
                        </span>
                        <span>
                          <strong className="font-semibold">Knowledge:</strong> {obj.knowledge}{" "}
                          <strong className="font-semibold">Skill:</strong> {obj.skill}{" "}
                          <strong className="font-semibold">Task:</strong> {obj.task}
                        </span>
                      </li>
                    ))}
                  </ul>
                )
              }
            />
            <FullWidthRow label="Learner Context" guidance={ROW_GUIDANCE.learnerContext} span={sessionCount}>
              {editing ? (
                <Editable rows={3} value={draft.learnerContext} onChange={(v) => setDraft((d) => ({ ...d, learnerContext: v }))} />
              ) : (
                draft.learnerContext
              )}
            </FullWidthRow>

            {/* L — LEARNING EXPERIENCES */}
            <SectionBand letter="L" title="Learning Experiences" span={sessionCount + 1} />
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Pre-Lesson"
              guidance={ROW_GUIDANCE.preLesson}
              render={(i) =>
                editing ? (
                  <Editable rows={4} value={draft.preLesson[i]} onChange={(v) => setSessionText("preLesson", i, v)} />
                ) : (
                  draft.preLesson[i]
                )
              }
            />
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Flow / Daloy ng Aralin"
              guidance={ROW_GUIDANCE.flow}
              render={(i) =>
                editing ? (
                  <div className="flex flex-col gap-3">
                    {draft.flow[i].map((step, j) => (
                      <div key={j} className="flex flex-col gap-1.5">
                        <Editable singleLine value={step.title} onChange={(v) => setFlowStep(i, j, "title", v)} placeholder="Step title" />
                        <Editable rows={3} value={step.details} onChange={(v) => setFlowStep(i, j, "details", v)} placeholder="Step details" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ol className="list-decimal list-inside space-y-1.5">
                    {draft.flow[i].map((step, j) => (
                      <li key={j}>
                        <strong className="font-semibold">{step.title}:</strong> {step.details}
                      </li>
                    ))}
                  </ol>
                )
              }
            />
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Learning Resources"
              guidance={ROW_GUIDANCE.learningResources}
              render={(i) =>
                editing ? (
                  <Editable
                    rows={4}
                    value={draft.learningResources[i].join("\n")}
                    onChange={(v) => setSessionList("learningResources", i, v)}
                  />
                ) : (
                  <ul className="list-disc list-inside space-y-0.5">
                    {draft.learningResources[i].map((r, j) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                )
              }
            />
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Opportunities for Integration"
              guidance={ROW_GUIDANCE.opportunitiesForIntegration}
              render={(i) =>
                editing ? (
                  <Editable
                    rows={4}
                    value={draft.opportunitiesForIntegration[i].join("\n")}
                    onChange={(v) => setSessionList("opportunitiesForIntegration", i, v)}
                  />
                ) : (
                  <ul className="list-disc list-inside space-y-0.5">
                    {draft.opportunitiesForIntegration[i].map((o, j) => (
                      <li key={j}>{o}</li>
                    ))}
                  </ul>
                )
              }
            />

            {/* A — ASSESSMENT */}
            <SectionBand letter="A" title="Assessment" span={sessionCount + 1} />
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Formative Assessment"
              guidance={ROW_GUIDANCE.formativeAssessment}
              render={(i) =>
                editing ? (
                  <Editable rows={4} value={draft.formativeAssessment[i]} onChange={(v) => setSessionText("formativeAssessment", i, v)} />
                ) : (
                  draft.formativeAssessment[i]
                )
              }
            />

            {/* W — WAYS FORWARD */}
            <SectionBand letter="W" title="Ways Forward" span={sessionCount + 1} />
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Extended Learning Opportunities"
              guidance={ROW_GUIDANCE.extendedLearningOpportunities}
              render={(i) =>
                editing ? (
                  <Editable
                    rows={4}
                    value={draft.extendedLearningOpportunities[i]}
                    onChange={(v) => setSessionText("extendedLearningOpportunities", i, v)}
                  />
                ) : (
                  draft.extendedLearningOpportunities[i]
                )
              }
            />
            <PerSessionRow
              sessionLabels={draft.sessionLabels}
              label="Reflections"
              guidance={ROW_GUIDANCE.reflections}
              render={(i) =>
                editing ? (
                  <Editable rows={4} value={draft.reflections[i]} onChange={(v) => setSessionText("reflections", i, v)} />
                ) : (
                  draft.reflections[i]
                )
              }
            />
          </tbody>
        </table>
      </div>

      {/* Signatories */}
      <section aria-label="Signatories" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Signatory
          label="Prepared by"
          name={draft.signatories.preparedBy}
          editing={editing}
          onChange={(v) => updateSig({ preparedBy: v })}
        />
        <Signatory
          label="Checked by"
          name={draft.signatories.checkedBy}
          editing={editing}
          onChange={(v) => updateSig({ checkedBy: v })}
        />
        <Signatory
          label="Noted by"
          name={draft.signatories.notedBy}
          editing={editing}
          onChange={(v) => updateSig({ notedBy: v })}
        />
      </section>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {editing
            ? "Editing your draft — changes are kept locally. Click “Done editing” when finished."
            : "This is an AI-generated draft. Use Edit to complete the highlighted fields and adapt it before classroom use."}
        </p>
        <Button onClick={onBackToDashboard}>Back to Dashboard</Button>
      </div>
    </div>
  )
}

/** A row whose content is shared across all sessions (single full-width cell). */
function FullWidthRow({
  label,
  guidance,
  span,
  children,
}: {
  label: string
  guidance?: string
  span: number
  children: ReactNode
}) {
  return (
    <tr>
      <RowLabel label={label} guidance={guidance} />
      <td className={CELL} colSpan={span}>
        {children}
      </td>
    </tr>
  )
}

/** A row with one cell per session. */
function PerSessionRow({
  label,
  guidance,
  sessionLabels,
  render,
}: {
  label: string
  guidance?: string
  sessionLabels: string[]
  render: (sessionIndex: number) => ReactNode
}) {
  return (
    <tr>
      <RowLabel label={label} guidance={guidance} />
      {sessionLabels.map((_, i) => {
        const content = render(i)
        const amber = typeof content === "string" && isTeacherTodo(content)
        return (
          <td key={i} className={cn(CELL, amber && "bg-accent/20 text-accent-foreground")}>
            {content}
          </td>
        )
      })}
    </tr>
  )
}

/** Inline editable control: single-line `Input` or multi-line `Textarea`. */
function Editable({
  value,
  onChange,
  rows = 3,
  singleLine,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  rows?: number
  singleLine?: boolean
  placeholder?: string
}) {
  if (singleLine) {
    return (
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs"
      />
    )
  }
  return (
    <Textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-0 resize-y text-xs leading-relaxed"
    />
  )
}

/** Uppercase section heading used above the Lesson Information block. */
function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
    >
      {children}
    </h3>
  )
}

/** Label/value row inside the Lesson Information block. */
function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-x-4 px-4 py-2.5">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}

/** Left-column row label + italic ILAW guidance copy. */
function RowLabel({ label, guidance }: { label: string; guidance?: string }) {
  return (
    <th scope="row" className="border border-border bg-muted/60 p-3 text-left align-top">
      <span className="block text-xs font-semibold text-foreground">{label}</span>
      {guidance && (
        <span className="mt-1 block text-[11px] italic font-normal leading-snug text-muted-foreground">
          {guidance}
        </span>
      )}
    </th>
  )
}

/** Full-width ILAW section band (I / L / A / W). */
function SectionBand({ letter, title, span }: { letter: string; title: string; span: number }) {
  return (
    <tr>
      <td
        colSpan={span}
        className="border border-border bg-secondary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground"
      >
        {letter} — {title}
      </td>
    </tr>
  )
}

/** A single signatory block (name over a labeled rule). */
function Signatory({
  label,
  name,
  editing,
  onChange,
}: {
  label: string
  name: string
  editing: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}:</span>
      {editing ? (
        <Input
          value={name}
          placeholder="Name"
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm"
        />
      ) : (
        <span className="min-h-6 text-sm font-medium text-foreground">{name || " "}</span>
      )}
      <span className="border-t border-border pt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        Signature over printed name
      </span>
    </div>
  )
}
