/**
 * Onboarding — guided first-time setup page (`/onboarding`).
 *
 * Protected, focused page (no app nav) that hosts the {@link OnboardingWizard}.
 * Brand-new teachers are routed here by the RequireOnboarded guard until they
 * finish setup. If the user has already completed onboarding, this redirects to
 * the dashboard so the page can't be revisited.
 */

import { Navigate } from "react-router"

import { BrandLogo } from "@/components/brand/brand-logo"
import { Card, CardContent } from "@/components/ui/card"
import { paths } from "@/config/paths"
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard"
import { useUser } from "@/lib/auth"

/**
 * Onboarding page.
 *
 * @returns The centred onboarding card, or a redirect to /app when already done.
 */
export default function OnboardingPage() {
  const user = useUser()

  // Already onboarded — don't let the flow be re-entered.
  if (user.data?.onboardingStep === "COMPLETED") {
    return <Navigate to={paths.app.root.getHref()} replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10 sm:py-16">
      <div className="mb-8">
        <BrandLogo />
      </div>
      <Card className="w-full max-w-xl shadow-sm">
        <CardContent className="py-8">
          <OnboardingWizard />
        </CardContent>
      </Card>
    </div>
  )
}
