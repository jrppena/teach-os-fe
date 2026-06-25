import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, Sparkles, FileCheck } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Enter your lesson details",
    description:
      "Provide your grade level, subject, term, week, and learning competencies. TeachOS uses this to tailor the draft to your exact class context.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get an AI-generated draft",
    description:
      "TeachOS generates a complete ILAW-format lesson plan with all sections pre-filled — objectives, procedures, assessment, and more — aligned with MATATAG and DO 003 s. 2026.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Review, complete, and export",
    description:
      "Fill in the amber-highlighted placeholders to adapt the draft to your actual learners. Then export a school-ready document in DOCX or PDF format.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            How It Works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From blank page to ILAW draft in three steps
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            TeachOS handles the structure — you bring the professional judgment.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Connecting line (desktop only) */}
          <div className="absolute top-10 left-0 right-0 hidden h-px md:block"
            style={{ background: "linear-gradient(to right, transparent, var(--color-border), transparent)" }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={step.number}
                className="relative border-border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  {/* Number badge */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
