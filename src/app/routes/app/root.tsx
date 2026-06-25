/**
 * Authenticated app shell.
 *
 * Layout for everything under `/app`. Renders a minimal top bar with the signed-in
 * user and a Logout action, plus an <Outlet/> for child routes. Route-level access
 * is enforced by <ProtectedRoute> in the router; this component assumes a user.
 */

import { Outlet, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import { useLogout, useUser } from "@/lib/auth"

export default function AppRoot() {
  const user = useUser()
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate(paths.auth.login.getHref(), { replace: true }),
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="text-base font-semibold text-foreground">ILAW</span>
        <div className="flex items-center gap-3">
          {user.data && (
            <span className="text-sm text-muted-foreground">
              {user.data.firstName} {user.data.lastName}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            {logout.isPending ? "Signing out…" : "Log Out"}
          </Button>
        </div>
      </header>
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
