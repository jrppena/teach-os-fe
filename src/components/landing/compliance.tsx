import { ShieldCheck, GraduationCap, BookOpen } from "lucide-react"

const points = [
  {
    icon: ShieldCheck,
    title: "Teacher-in-the-loop, always",
    body: "TeachOS generates a structured draft with sample content to guide you — not a finished plan to submit as-is. Every section is a starting point that you review, adapt, and complete for your actual learners.",
  },
  {
    icon: GraduationCap,
    title: "Professional responsibility stays with you",
    body: "Core instructional decisions — learning outcomes, pacing, differentiation — remain the teacher's professional responsibility. TeachOS handles formatting so you can focus on pedagogy, in line with DepEd Order No. 16 s. 2026 (Sec. 23) and DO No. 003 s. 2026.",
  },
  {
    icon: BookOpen,
    title: "DLL/DLP still accepted until end of Term 1",
    body: "The legacy Daily Lesson Log and Daily Lesson Plan format (DO No. 42, s. 2016) remains usable until the end of Term 1, SY 2026–2027, per DO 16 Sec. 43. TeachOS supports both formats.",
  },
]

export function Compliance() {
  return (
    <section id="compliance" className="py-20 md:py-28" style={{ background: "var(--surface-calm)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-start">
          {/* Left: header */}
          <div className="flex flex-col gap-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Responsible AI
              </p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Designed with responsible AI in mind.
              </h2>
              <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
                TeachOS is built around one principle: AI assists, the teacher decides. The draft is a tool — your expertise makes it a lesson.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                Aligned with <span className="font-medium text-foreground">DepEd Order No. 16 s. 2026</span> and <span className="font-medium text-foreground">DO 003 s. 2026</span>
              </p>
            </div>
          </div>

          {/* Right: points */}
          <div className="flex flex-col gap-6">
            {points.map((point) => {
              const Icon = point.icon
              return (
                <div key={point.title} className="flex gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-foreground">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{point.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
