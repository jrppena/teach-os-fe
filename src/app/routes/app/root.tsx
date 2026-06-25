/**
 * Authenticated app shell.
 *
 * Layout for everything under `/app`. Renders a minimal top bar with the signed-in
 * user and a Logout action, plus an <Outlet/> for child routes. Route-level access
 * is enforced by <ProtectedRoute> in the router; this component assumes a user.
 */

import { Outlet } from "react-router"

import { DashboardNav } from "@/components/layouts/dashboard-nav"

export default function AppRoot() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

/**
 * Route-level error boundary for the authenticated subtree.
 * Shown by react-router when a child route loader/render throws.
 */
export function ErrorBoundary() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
      <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">
        Please refresh the page or try again.
      </p>
    </div>
  )
}
