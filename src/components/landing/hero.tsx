import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { LessonPlanMockup } from "@/components/landing/lesson-plan-mockup"
import { BRAND } from "@/config/branding"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="flex flex-col gap-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Built for Filipino teachers · Lesson planning, first
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              The platform built for{" "}
              <span className="text-primary">Filipino teachers</span> — starting with lesson plans.
            </h1>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground max-w-xl">
              {BRAND.name} turns grade level, subject, and competencies into an {BRAND.format}-format draft aligned with MATATAG and DO 003 s. 2026 — so you spend more time teaching, less time formatting.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="font-semibold">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works" className="font-semibold">
                  See How It Works
                </a>
              </Button>
            </div>

            {/* Trust line */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                "Built for Filipino teachers",
                "Review-first design",
                "Export to Word & PDF",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mockup */}
          <div className="flex justify-center lg:justify-end">
            <LessonPlanMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
