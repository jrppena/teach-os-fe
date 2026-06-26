/**
 * Settings — account/configuration page (`/settings`).
 *
 * Protected page that hosts user configuration. Its first (and currently only)
 * section lets teachers configure their AI-provider API keys. Rendered
 * standalone with its own <DashboardNav/> (no /app shell), matching /generate.
 */

import { DashboardNav } from "@/components/layouts/dashboard-nav"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ApiKeysSection } from "@/features/settings/components/api-keys-section"

/**
 * Settings page.
 *
 * @returns The settings UI: a top nav, page heading, and an API-keys card.
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage how ILAW connects to AI providers to generate your lesson plans.
          </p>
        </div>

        {/* API keys card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              AI Provider API Keys
            </CardTitle>
            <CardDescription className="text-sm">
              Add your own provider key and pick which one ILAW should use. Keys
              are securely stored on your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysSection />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
