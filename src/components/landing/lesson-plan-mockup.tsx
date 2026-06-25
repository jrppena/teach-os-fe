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
              teachos.app/editor
            </div>
          </div>
  
          {/* App chrome */}
          <div className="flex border-b border-border bg-primary/5 px-4 py-2 text-xs font-medium text-muted-foreground gap-4">
            <span className="text-primary border-b-2 border-primary pb-1">Lesson Plan Editor</span>
            <span>My Plans</span>
            <span>Export</span>
          </div>
  
          {/* Document body */}
          <div className="p-5 bg-background space-y-4 text-sm font-sans">
            {/* Header row */}
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ILAW Lesson Plan
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                  Draft
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground">
                <div><span className="text-muted-foreground">Grade:</span> Grade 7</div>
                <div><span className="text-muted-foreground">Subject:</span> English</div>
                <div><span className="text-muted-foreground">Week:</span> Week 3, Term 1</div>
                <div><span className="text-muted-foreground">Quarter:</span> First</div>
              </div>
            </div>
  
            {/* Section: Objectives */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                I. Objectives
              </p>
              <div className="space-y-1 pl-1 text-xs leading-relaxed text-foreground/80">
                <p>At the end of the lesson, learners will be able to:</p>
                <p>• Identify the main idea and supporting details in a text.</p>
                <p>• Analyze how the author develops the central idea.</p>
              </div>
            </div>
  
            {/* Highlighted placeholder section */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                II. Subject Matter
              </p>
              <div className="rounded-md border-2 border-dashed px-3 py-2.5 text-xs leading-relaxed space-y-1"
                style={{ borderColor: "var(--highlight)", background: "color-mix(in oklch, var(--highlight) 12%, transparent)" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="size-2 rounded-full" style={{ background: "var(--highlight)" }} />
                  <span className="font-semibold text-xs" style={{ color: "var(--highlight-foreground)" }}>
                    Needs your input
                  </span>
                </div>
                <p style={{ color: "var(--highlight-foreground)" }}>
                  Topic: <span className="italic opacity-70">[Enter specific topic from your class context]</span>
                </p>
                <p style={{ color: "var(--highlight-foreground)" }}>
                  Reference materials: <span className="italic opacity-70">[List textbook, pages, or resources]</span>
                </p>
              </div>
            </div>
  
            {/* Section: Procedure snippet */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                III. Learning Procedure
              </p>
              <div className="space-y-1 pl-1 text-xs leading-relaxed text-foreground/80">
                <p className="font-medium text-foreground">A. Elicit (Review)</p>
                <p>Ask learners to recall the previous lesson on text structures. Use a quick 3-question oral quiz.</p>
              </div>
            </div>
  
            {/* Export button row */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
              <button className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                Export DOCX
              </button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity">
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
  