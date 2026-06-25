/* -------------------------------------------------------------------------- */
/*  Login form                                                                  */
/*                                                                              */
/*  Email/password sign-in wired to the `useLogin` hook (Firebase credential    */
/*  check -> backend profile fetch). On success, redirects to the protected     */
/*  app (or the `redirectTo` query param set by ProtectedRoute).                 */
/* -------------------------------------------------------------------------- */

import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { validateEmail, validatePassword } from "@/utils/validators"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { EyeOff, Eye } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { useLogin } from "@/lib/auth"
import { paths } from "@/config/paths"


export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const login = useLogin()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get("redirectTo")

    const validate = () => {
      const e: Record<string, string> = {}
      const emailErr = validateEmail(email)
      const passErr = validatePassword(password)
      if (emailErr) e.email = emailErr
      if (passErr) e.password = passErr
      setErrors(e)
      return Object.keys(e).length === 0
    }

    const handleBlur = (field: string, validator: (v: string) => string, value: string) => {
      setTouched((t) => ({ ...t, [field]: true }))
      const err = validator(value)
      setErrors((e) => ({ ...e, [field]: err }))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setTouched({ email: true, password: true })
      if (!validate()) return
      login.mutate(
        { email, password },
        {
          onSuccess: () =>
            navigate(redirectTo || paths.app.generate.getHref(), { replace: true }),
        },
      )
    }

    return (
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          error={touched.email ? errors.email : undefined}
          placeholder="you@school.edu.ph"
          autoComplete="email"
          onChange={setEmail}
          onBlur={() => handleBlur("email", validateEmail, email)}
        />
        <FormField
          id="login-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          error={touched.password ? errors.password : undefined}
          placeholder="••••••••"
          autoComplete="current-password"
          onChange={setPassword}
          onBlur={() => handleBlur("password", validatePassword, password)}
          rightSlot={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(v === true)}
            />
            <Label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
              Remember me
            </Label>
          </div>
          <button
            type="button"
            className="text-xs text-primary hover:underline underline-offset-2"
          >
            Forgot password?
          </button>
        </div>

        {login.isError && (
          <p role="alert" className="text-sm text-destructive">
            {(login.error as Error)?.message ?? "Unable to sign in. Please try again."}
          </p>
        )}

        <Button type="submit" className="w-full mt-1" disabled={login.isPending}>
          {login.isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {login.isPending ? "Signing in…" : "Log In"}
        </Button>
      </form>
    )
  }
