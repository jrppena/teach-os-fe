/* -------------------------------------------------------------------------- */
/*  Register form                                                                */
/*                                                                              */
/*  Collects first/last name, email and password, then calls `useRegister`      */
/*  (Firebase account creation -> backend user row). On success, redirects to    */
/*  the protected app. No team concept.                                          */
/* -------------------------------------------------------------------------- */

import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { validateEmail, validatePassword, validateRequired } from "@/utils/validators"
import { Label } from "@/components/ui/label/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { EyeOff, Eye } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { useRegister } from "@/lib/auth"
import { paths } from "@/config/paths"

export function RegisterForm() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const register = useRegister()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get("redirectTo")

    const validators: Record<string, (v: string) => string> = {
      firstName: validateRequired("First name"),
      lastName: validateRequired("Last name"),
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (v) => (v === password ? "" : "Passwords do not match."),
    }

    const handleBlur = (field: string, value: string) => {
      setTouched((t) => ({ ...t, [field]: true }))
      setErrors((e) => ({ ...e, [field]: validators[field](value) }))
    }

    const validate = () => {
      const e: Record<string, string> = {}
      Object.entries({ firstName, lastName, email, password, confirmPassword }).forEach(
        ([k, v]) => {
          const err = validators[k](v)
          if (err) e[k] = err
        },
      )
      setErrors(e)
      return Object.keys(e).length === 0
    }

    const handleSubmit = (ev: React.FormEvent) => {
      ev.preventDefault()
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true,
      })
      if (!validate()) return
      register.mutate(
        { firstName, lastName, email, password },
        {
          onSuccess: () =>
            navigate(redirectTo || paths.app.root.getHref(), { replace: true }),
        },
      )
    }

    return (
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="reg-first-name"
            label="First Name"
            value={firstName}
            error={touched.firstName ? errors.firstName : undefined}
            placeholder="Maria"
            autoComplete="given-name"
            onChange={setFirstName}
            onBlur={() => handleBlur("firstName", firstName)}
          />
          <FormField
            id="reg-last-name"
            label="Last Name"
            value={lastName}
            error={touched.lastName ? errors.lastName : undefined}
            placeholder="Santos"
            autoComplete="family-name"
            onChange={setLastName}
            onBlur={() => handleBlur("lastName", lastName)}
          />
        </div>
        <FormField
          id="reg-email"
          label="Email"
          type="email"
          value={email}
          error={touched.email ? errors.email : undefined}
          placeholder="you@school.edu.ph"
          autoComplete="email"
          onChange={setEmail}
          onBlur={() => handleBlur("email", email)}
        />

        {/* Role — always Teacher, not selectable */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground">Role</Label>
          <div className="flex h-9 items-center rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground select-none">
            Teacher
            <span className="ml-auto text-xs opacity-60">Provisioned by admin</span>
          </div>
        </div>

        <FormField
          id="reg-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          error={touched.password ? errors.password : undefined}
          placeholder="••••••••"
          autoComplete="new-password"
          onChange={setPassword}
          onBlur={() => handleBlur("password", password)}
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
        <FormField
          id="reg-confirm"
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          placeholder="••••••••"
          autoComplete="new-password"
          onChange={setConfirmPassword}
          onBlur={() => handleBlur("confirmPassword", confirmPassword)}
          rightSlot={
            <button
              type="button"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowConfirm((s) => !s)}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        {register.isError && (
          <p role="alert" className="text-sm text-destructive">
            {(register.error as Error)?.message ?? "Unable to create account. Please try again."}
          </p>
        )}

        <Button type="submit" className="w-full mt-1" disabled={register.isPending}>
          {register.isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {register.isPending ? "Creating account…" : "Create Account"}
        </Button>
      </form>
    )
  }
