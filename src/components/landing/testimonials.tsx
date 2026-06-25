import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Maria Santos",
    role: "Grade 7 English Teacher",
    school: "Batangas National High School",
    initials: "MS",
    quote:
      "I used to spend Sunday evenings building lesson plans from scratch. With TeachOS, I have a solid ILAW draft in minutes — and I actually spend more time thinking about my students than about formatting.",
  },
  {
    name: "Rodel Cruz",
    role: "Science Department Head",
    school: "Cebu City National Science High School",
    initials: "RC",
    quote:
      "The yellow placeholders are a game-changer. I know exactly what still needs my judgment and what the AI has handled. It keeps the teacher in control without slowing you down.",
  },
  {
    name: "Analiza Reyes",
    role: "Master Teacher I",
    school: "Quezon City Division — SDO",
    initials: "AR",
    quote:
      "Our division piloted TeachOS during Term 1 and teacher feedback was overwhelmingly positive. Compliance with the MATATAG format improved and teachers reported significantly less administrative stress.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Testimonials
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Filipino teachers are already saving hours
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border bg-card shadow-sm flex flex-col">
              <CardContent className="p-6 flex flex-col gap-5 flex-1">
                <Quote className="size-7 text-primary/30" />
                <p className="flex-1 text-sm leading-relaxed text-foreground/80 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                    <p className="text-xs text-muted-foreground">{t.school}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
