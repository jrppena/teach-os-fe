/**
 * Feedback — send-feedback page (`/feedback`).
 *
 * Protected page where teachers submit product feedback. Rendered standalone
 * with its own <DashboardNav/> (via AppPageLayout), matching /settings and
 * /generate.
 */

import { AppPageLayout } from "@/components/layouts/app-page-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BRAND } from "@/config/branding"
import { FeedbackForm } from "@/features/feedback/components/feedback-form"

/**
 * Feedback page.
 *
 * @returns The feedback UI: page heading + a card wrapping the feedback form.
 */
export default function FeedbackPage() {
  return (
    <AppPageLayout maxWidth="max-w-2xl">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Send feedback
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Found a bug or have an idea? Tell us how we can make {BRAND.name} better
          for you.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Your feedback</CardTitle>
          <CardDescription className="text-sm">
            Your message goes straight to the {BRAND.name} team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    </AppPageLayout>
  )
}
