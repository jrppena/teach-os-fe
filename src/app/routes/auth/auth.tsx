// Auth page — hosts the login/register tab pair and Google OAuth flows.
// Renders GoogleNameStep in place of the Tabs when a brand-new Google sign-up
// is in progress (useGoogleSignup().pendingPrefill is set). On any auth
// success, navigates to redirectTo || /app with replace:true.

import { BookOpen, CheckCircle2 } from "lucide-react"
import { useLocation, useNavigate, useSearchParams } from "react-router"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Separator } from "@/components/ui/separator"
import { paths } from "@/config/paths"
import { LoginForm } from "@/features/auth/components/login-form"
import { RegisterForm } from "@/features/auth/components/register-form"
import { GoogleButton } from "@/features/auth/components/google-button"
import { GoogleNameStep } from "@/features/auth/components/google-name-step"
import { useGoogleSignup, useGoogleLogin } from "@/features/auth/api/use-google-auth"

function BrandPanel() {
  const highlights = [
    "Generate ILAW-format drafts in minutes",
    "Review, edit, and export to Word or PDF",
    "Built for DepEd MATATAG compliance",
  ]
  return (
    <div className="flex flex-col justify-between p-10 h-full">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-white/20">
          <BookOpen className="size-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-white tracking-tight">
          ILAW <span className="font-normal opacity-80">Lesson Plan Generator</span>
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white leading-snug text-balance">
            AI-assisted lesson plans,<br />the ILAW way.
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Designed for Filipino teachers navigating the DepEd MATATAG curriculum.
          </p>
        </div>
        <ul className="space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="size-4 text-white/60 shrink-0 mt-0.5" />
              <span className="text-sm text-white/80 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/40 leading-relaxed">
        ILAW supports teachers at every stage — draft, review, and publish.
      </p>
    </div>
  )
}

/** Thin divider with centred "or continue with email" label. */
function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground shrink-0">or continue with email</span>
      <Separator className="flex-1" />
    </div>
  )
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")

  const isRegister = location.pathname === paths.auth.register.path
  const activeTab = isRegister ? "register" : "login"

  const handleTabChange = (value: string) => {
    const search = location.search
    const target =
      value === "register"
        ? paths.auth.register.path
        : paths.auth.login.path
    navigate(`${target}${search}`, { replace: true })
  }

  const goToApp = () => navigate(redirectTo || paths.app.root.getHref(), { replace: true })

  // ── Google login (sign-in tab) ───────────────────────────────────────────
  const googleLogin = useGoogleLogin()
  const handleGoogleLogin = () => {
    googleLogin.mutate(undefined, { onSuccess: goToApp })
  }

  // ── Google signup (register tab, two-step) ───────────────────────────────
  const googleSignup = useGoogleSignup()
  const handleGoogleSignupStart = async () => {
    const user = await googleSignup.start()
    if (user) goToApp()
  }
  const handleGoogleSignupComplete = async (firstName: string, lastName: string, password: string) => {
    const user = await googleSignup.complete(firstName, lastName, password)
    if (user) goToApp()
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-[46%] lg:min-h-screen lg:sticky lg:top-0 bg-primary flex-shrink-0">
        <div className="flex items-center gap-3 px-5 py-4 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-md bg-white/20">
            <BookOpen className="size-4 text-white" />
          </div>
          <span className="text-base font-semibold text-white">
            ILAW <span className="font-normal opacity-70">Lesson Plan Generator</span>
          </span>
        </div>

        <div className="hidden lg:block h-full">
          <BrandPanel />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background px-5 py-10 lg:px-12">
        <div className="w-full max-w-sm">
          <Card className="shadow-md border-border">
            <CardHeader className="pb-4 pt-6 px-6">
              {/* Name-prompt step replaces the tabs when a new Google account is pending */}
              {googleSignup.pendingPrefill ? (
                <GoogleNameStep
                  prefill={googleSignup.pendingPrefill}
                  isPending={googleSignup.isPending}
                  error={googleSignup.error}
                  onComplete={handleGoogleSignupComplete}
                  onCancel={googleSignup.cancel}
                />
              ) : (
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="login" className="flex-1 text-sm">Log In</TabsTrigger>
                    <TabsTrigger value="register" className="flex-1 text-sm">Create Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-0">
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Sign in to your ILAW account.
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <GoogleButton
                        label="Sign in with Google"
                        onClick={handleGoogleLogin}
                        isPending={googleLogin.isPending}
                        error={googleLogin.isError ? (googleLogin.error as Error)?.message : null}
                      />
                      <OrDivider />
                      <LoginForm />
                    </div>
                  </TabsContent>

                  <TabsContent value="register" className="mt-0">
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-foreground">Create your account</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Join ILAW and start generating DepEd-compliant lesson plans.
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <GoogleButton
                        label="Sign up with Google"
                        onClick={handleGoogleSignupStart}
                        isPending={googleSignup.isPending}
                        error={googleSignup.error}
                      />
                      <OrDivider />
                      <RegisterForm />
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0">
              <p className="text-[11px] text-muted-foreground leading-relaxed text-center border-t border-border pt-4 mt-2">
                By continuing, you agree this tool generates draft content that must be reviewed before use.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
