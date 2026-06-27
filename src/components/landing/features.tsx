import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  PenLine,
  Highlighter,
  Download,
  History,
  RefreshCw,
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
      "A rich text editor lets you revise objectives, learning procedures, assessment tasks, and every other section independently.",
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
    icon: History,
    title: "Version History",
    description:
      "Every save creates a snapshot. Browse previous versions and restore any earlier draft with a single click — you never lose work.",
  },
  {
    icon: RefreshCw,
    title: "Multiple AI Providers",
    description:
      "Reliable generation backed by automatic failover across multiple AI providers, so you always get a draft even when one service is unavailable.",
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
