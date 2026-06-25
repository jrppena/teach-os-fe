import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8">
        <div className="space-y-4">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
            Spend less time formatting,{" "}
            <span className="opacity-80">more time teaching.</span>
          </h2>
          <p className="text-pretty text-lg text-primary-foreground/70 leading-relaxed max-w-xl mx-auto">
            Join Filipino teachers who are reclaiming their Sundays with TeachOS. Your first plan is free — no credit card required.
          </p>
        </div>
        <Button
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base px-8 shadow-lg"
        >
          Get Started Free
        </Button>
        <p className="text-xs text-primary-foreground/50">
          Free to start • No credit card required • Export to DOCX &amp; PDF
        </p>
      </div>
    </section>
  )
}
