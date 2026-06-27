/**
 * Settings — account/configuration page (`/settings`).
 *
 * Protected page that hosts user configuration:
 * - School Information: DepEd school header fields for DOCX export.
 * - AI Provider API Keys: Grok/Gemini keys for lesson-plan generation.
 *
 * Rendered standalone with its own <DashboardNav/> (no /app shell),
 * matching /generate.
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
import { SchoolInfoSection } from "@/features/settings/components/school-info-section"

/**
 * Settings page.
 *
 * @returns The settings UI: page heading, school info card, and API-keys card.
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
          Manage your school information and how {BRAND.name} connects to AI providers.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* School information card — populates the DepEd header block in DOCX exports */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">School Information</CardTitle>
            <CardDescription className="text-sm">
              These details appear in the DepEd header block of exported DOCX lesson
              plans (school name, region, division, district, address).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SchoolInfoSection />
          </CardContent>
        </Card>

        {/* API keys card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">AI Provider API Keys</CardTitle>
            <CardDescription className="text-sm">
              Add your own provider key and pick which one {BRAND.name} should use. Keys
              are securely stored on your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysSection />
          </CardContent>
        </Card>
      </div>
    </AppPageLayout>
  )
}
