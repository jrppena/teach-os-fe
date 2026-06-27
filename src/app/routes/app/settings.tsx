/**
 * Settings — account/configuration page (`/settings`).
 *
 * Protected page that hosts user configuration. Its first (and currently only)
 * section lets teachers configure their AI-provider API keys. Rendered
 * standalone with its own <DashboardNav/> (no /app shell), matching /generate.
 */

import { AppPageLayout } from "@/components/layouts/app-page-layout"
import { BRAND } from "@/config/branding"
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
    <AppPageLayout maxWidth="max-w-2xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage how {BRAND.name} connects to AI providers to generate your lesson plans.
          </p>
        </div>

        {/* API keys card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              AI Provider API Keys
            </CardTitle>
            <CardDescription className="text-sm">
              Add your own provider key and pick which one {BRAND.name} should use. Keys
              are securely stored on your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysSection />
          </CardContent>
        </Card>
    </AppPageLayout>
  )
}
