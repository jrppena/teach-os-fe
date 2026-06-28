// Top navigation bar for the authenticated app area (TeachOS TopNav pattern).
// Renders the TeachOS logo/wordmark, a centered role-based nav, and a user avatar
// with a dropdown (profile / settings / log out). Used by the /app shell and by
// standalone authenticated pages (e.g. the /generate flow).

import {
  BookOpen,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  User as UserIcon,
} from "lucide-react"
import { BrandLogo } from "@/components/brand/brand-logo"
import { useLocation, useNavigate } from "react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { paths } from "@/config/paths"
import { useLogout, useUser } from "@/lib/auth"
import { cn } from "@/lib/utils"

// Center navigation entries. `to` is matched against the current path to mark
// the active item; entries without a route are placeholders for upcoming areas.
const navItems = [
  { label: "My Lesson Plans", icon: LayoutDashboard, to: paths.app.root.getHref() },
  { label: "Lesson Plan Generation", icon: FileText, to: paths.app.generate.getHref() },
  { label: "Resources", icon: BookOpen, to: undefined },
] as const

// Builds two-letter initials from the user's name for the avatar fallback.
function initials(firstName?: string, lastName?: string) {
  const a = firstName?.[0] ?? ""
  const b = lastName?.[0] ?? ""
  return (a + b).toUpperCase() || "U"
}

/**
 * Sticky dashboard header following the TeachOS TopNav pattern.
 *
 * Reads the current user via `useUser` and signs out via `useLogout`, redirecting
 * to the login page on success. Assumes an authenticated context (rendered under
 * a protected route).
 *
 * @returns The application top bar: brand (left), nav (center), user menu (right).
 */
export function DashboardNav() {
  const user = useUser()
  const logout = useLogout()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate(paths.auth.login.getHref(), { replace: true }),
    })
  }

  const fullName = user.data
    ? `${user.data.firstName} ${user.data.lastName}`
    : "Teacher"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-4">
        {/* Logo / Wordmark */}
        <button
          type="button"
          onClick={() => navigate(paths.app.root.getHref())}
          className="flex shrink-0 items-center"
        >
          <BrandLogo />
        </button>

        {/* Center nav */}
        <nav
          className="flex flex-1 items-center justify-center gap-1"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const active = item.to
              ? location.pathname === item.to
              : false
            return (
              <Button
                key={item.label}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                disabled={!item.to}
                onClick={() => item.to && navigate(item.to)}
                className={cn(
                  active
                    ? "bg-primary/10 font-medium text-primary hover:bg-primary/15"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon data-icon="inline-start" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            )
          })}
        </nav>

        {/* User avatar + dropdown */}
        <div className="flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 pr-2">
                <Avatar className="size-7">
                  <AvatarImage src="" alt={fullName} />
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {initials(user.data?.firstName, user.data?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">{fullName}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {user.data?.email ?? "Teacher"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  <UserIcon data-icon="inline-start" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(paths.app.settings.getHref())}
                >
                  <Settings data-icon="inline-start" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(paths.app.feedback.getHref())}
                >
                  <MessageSquare data-icon="inline-start" />
                  Send feedback
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={logout.isPending}
                className="text-destructive focus:text-destructive"
              >
                <LogOut data-icon="inline-start" />
                {logout.isPending ? "Signing out…" : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
