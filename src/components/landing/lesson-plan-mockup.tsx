/**
 * LessonPlanMockup — hero-section browser mock showing the actual generated output.
 *
 * Mirrors the real step-result layout: a Lesson Information key-value block
 * followed by the DLL-style ILAW table (Lesson Component + session columns,
 * section bands I/L, amber placeholder cells).
 */
export function LessonPlanMockup() {
  return (
    <div className="w-full max-w-md lg:max-w-lg">
      {/* Browser chrome */}
      <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-yellow-400/70" />
          <span className="size-3 rounded-full bg-green-400/70" />
          <div className="mx-auto flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-xs text-muted-foreground w-48">
            <span className="size-2 rounded-full bg-primary/40" />
            teachos.app/generate
          </div>
        </div>

        {/* App top bar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded bg-primary text-[9px] font-bold text-primary-foreground">T</span>
            <span className="text-xs font-semibold text-foreground">TeachOS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">GENERATED</span>
            <span className="text-[10px] text-muted-foreground">ILAW Lesson Plan</span>
          </div>
        </div>

        <div className="bg-background p-4 space-y-3 text-xs font-sans">
          {/* Lesson Information block */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="bg-muted/40 px-3 py-1.5 border-b border-border">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Lesson Information
              </span>
            </div>
            <dl className="divide-y divide-border">
              {[
                ["Lesson Title", "Main Idea and Supporting Details"],
                ["Learning Area/s", "English — Grade 7"],
                ["Grade Level & Section", "7 — Section A · Week 3, Term 1"],
                ["No. of Sessions", "2 sessions × 45 min"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 px-3 py-1.5">
                  <dt className="w-28 shrink-0 text-[10px] font-medium text-muted-foreground leading-relaxed">
                    {label}
                  </dt>
                  <dd className="text-[10px] text-foreground leading-relaxed">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* DLL-style ILAW table */}
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse text-[10px]">
              {/* Header */}
              <thead>
                <tr>
                  <th className="border border-border bg-primary px-2 py-1.5 text-left font-semibold uppercase tracking-wide text-primary-foreground w-24">
                    Lesson Component
                  </th>
                  <th className="border border-border bg-primary px-2 py-1.5 text-left font-semibold uppercase tracking-wide text-primary-foreground">
                    Session 1
                  </th>
                  <th className="border border-border bg-primary px-2 py-1.5 text-left font-semibold uppercase tracking-wide text-primary-foreground">
                    Session 2
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* I — INTENTIONS band */}
                <tr>
                  <td
                    colSpan={3}
                    className="border border-border bg-primary/8 px-2 py-1 font-semibold text-primary"
                  >
                    I — Intentions
                  </td>
                </tr>
                {/* Learning Competency — full width */}
                <tr>
                  <td className="border border-border bg-muted/30 px-2 py-1.5 font-medium text-muted-foreground align-top">
                    Learning Competency
                  </td>
                  <td
                    colSpan={2}
                    className="border border-border px-2 py-1.5 text-foreground/80 leading-relaxed"
                  >
                    EN7RC-Id-2.15: Identify main idea and supporting details in texts read.
                  </td>
                </tr>
                {/* Learning Objectives — amber placeholder in session 2 */}
                <tr>
                  <td className="border border-border bg-muted/30 px-2 py-1.5 font-medium text-muted-foreground align-top">
                    Learning Objectives
                  </td>
                  <td className="border border-border px-2 py-1.5 text-foreground/80 leading-relaxed align-top">
                    <span className="font-medium text-foreground">Knowledge:</span> Define main idea and supporting details.{" "}
                    <span className="font-medium text-foreground">Skill:</span> Locate them in informational text.
                  </td>
                  <td className="border border-border px-2 py-1.5 align-top">
                    {/* Amber placeholder */}
                    <div
                      className="rounded px-2 py-1.5 leading-relaxed"
                      style={{
                        background: "color-mix(in oklch, var(--color-accent) 15%, transparent)",
                        border: "1px solid color-mix(in oklch, var(--color-accent) 40%, transparent)",
                        color: "var(--color-accent-foreground)",
                      }}
                    >
                      <span className="font-semibold">⚠ Needs your input</span>
                      <br />
                      <span className="opacity-70 italic">[Adapt objectives to your actual class context]</span>
                    </div>
                  </td>
                </tr>
                {/* L — LEARNING EXPERIENCES band */}
                <tr>
                  <td
                    colSpan={3}
                    className="border border-border bg-primary/8 px-2 py-1 font-semibold text-primary"
                  >
                    L — Learning Experiences
                  </td>
                </tr>
                {/* Pre-Lesson row */}
                <tr>
                  <td className="border border-border bg-muted/30 px-2 py-1.5 font-medium text-muted-foreground align-top">
                    Pre-Lesson
                  </td>
                  <td className="border border-border px-2 py-1.5 text-foreground/80 leading-relaxed align-top">
                    Recall previous lesson on text structures. 3-question oral quiz.
                  </td>
                  <td className="border border-border px-2 py-1.5 text-foreground/80 leading-relaxed align-top">
                    Review student notes. Quick pair-share activity.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Export buttons */}
          <div className="flex items-center justify-end gap-2 pt-0.5">
            <button className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              Edit
            </button>
            <button className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              Export DOCX
            </button>
            <button className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground">
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Shadow accent */}
      <div className="mx-4 h-3 rounded-b-xl bg-primary/10 blur-sm" />
    </div>
  )
}
