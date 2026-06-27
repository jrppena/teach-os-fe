/**
 * AppPageLayout — shared full-page wrapper for all authenticated app pages.
 *
 * Renders DashboardNav + a centred <main> with consistent horizontal padding,
 * vertical rhythm (py-10 / sm:py-14), and a configurable max-width.
 * All authenticated routes (dashboard, generate, plan-detail, settings) use
 * this component so spacing and width are defined in one place.
 */

import { DashboardNav } from "@/components/layouts/dashboard-nav"
import { cn } from "@/lib/utils"

interface AppPageLayoutProps {
  /** Page content. */
  children: React.ReactNode
  /**
   * Tailwind max-width class applied to the inner container.
   * @default "max-w-7xl"
   */
  maxWidth?: string
}

/**
 * Full-page authenticated layout.
 *
 * @param children - Route-level page content.
 * @param maxWidth - Tailwind max-width token; defaults to `max-w-7xl`.
 * @returns A sticky-nav + centred main wrapper.
 */
export function AppPageLayout({
  children,
  maxWidth = "max-w-7xl",
}: AppPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav />
      <main className={cn("mx-auto w-full flex-1 px-4 py-10 sm:py-14", maxWidth)}>
        {children}
      </main>
    </div>
  )
}
