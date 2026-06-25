/**
 * Dashboard — index route of the authenticated app (`/app`).
 *
 * Minimal placeholder landing page shown after login/registration. Greets the
 * signed-in user; real dashboard widgets land here as features are built.
 */

import { useUser } from "@/lib/auth"

export default function Dashboard() {
  const user = useUser()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome{user.data ? `, ${user.data.firstName}` : ""}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You're signed in. Lesson planning tools will appear here soon.
      </p>
    </div>
  )
}
