import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  PenLine,
  Highlighter,
  Download,
  LayoutGrid,
  KeyRound,
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "ILAW-Format Drafts",
    description:
      "Every generated plan follows the ILAW structure and is aligned with the MATATAG curriculum framework and DepEd DO 003 s. 2026 requirements.",
  },
  {
    icon: PenLine,
    title: "Editable, Section by Section",
    description:
      "Toggle into edit mode to revise objectives, learning procedures, assessment tasks, and every other section inline before you export.",
  },
  {
    icon: Highlighter,
    title: "Yellow Placeholder Highlights",
    description:
      "Amber-highlighted sections clearly mark what still needs your professional input — so no placeholder ever slips into a final submission.",
  },
  {
    icon: Download,
    title: "Export to Word & PDF",
    description:
      "Export school-ready documents in DOCX or PDF format, properly formatted and ready to submit or share.",
  },
  {
    icon: LayoutGrid,
    title: "Saved Plans Library",
    description:
      "Every plan you generate is saved to your dashboard. Reopen, review, or delete any lesson plan whenever you need it.",
  },
  {
    icon: KeyRound,
    title: "Bring Your Own AI Keys",
    description:
      "Connect your own Grok or Gemini API key in Settings and generate plans on your preferred provider — you stay in control.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for lesson planning
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Purpose-built for the Filipino classroom, from generation to final document. More teacher tools are on the way.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
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
