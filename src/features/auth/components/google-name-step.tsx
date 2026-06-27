/* -------------------------------------------------------------------------- */
/*  GoogleNameStep                                                             */
/*                                                                             */
/*  Inline name + password confirmation step shown after a brand-new Google   */
/*  sign-up. Lets the teacher confirm their name (pre-filled from Google),    */
/*  set a password, and then calls complete() so both the email/password      */
/*  credential and the backend user row are created in one step.              */
/* -------------------------------------------------------------------------- */

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { BRAND } from '@/config/branding';
import { validatePassword, validateRequired } from '@/utils/validators';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';

interface GoogleNameStepProps {
  /** Names pre-filled from the Google profile. */
  prefill: { firstName: string; lastName: string };
  /** Whether the complete() call is in flight. */
  isPending: boolean;
  /** Error from the complete() or cancel() call. */
  error?: string | null;
  /** Called when the teacher confirms their name and sets a password. */
  onComplete: (firstName: string, lastName: string, password: string) => void;
  /** Called when the teacher backs out — signs out Firebase. */
  onCancel: () => void;
}

const validateFirstName = validateRequired('First name');
const validateLastName = validateRequired('Last name');

function ToggleButton({
  show,
  onToggle,
  label,
}: {
  show: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="text-muted-foreground hover:text-foreground transition-colors"
      onClick={onToggle}
    >
      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

/**
 * Name-prompt + password step rendered inline within the auth Card.
 * @param prefill    - Google-sourced first/last name pre-fill values.
 * @param isPending  - Disables the form while the register call is in flight.
 * @param error      - Error string rendered below the form.
 * @param onComplete - Callback with (firstName, lastName, password) when the teacher continues.
 * @param onCancel   - Callback when the teacher clicks Back.
 */
export function GoogleNameStep({
  prefill,
  isPending,
  error,
  onComplete,
  onCancel,
}: GoogleNameStepProps) {
  const [firstName, setFirstName] = useState(prefill.firstName);
  const [lastName, setLastName] = useState(prefill.lastName);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validators: Record<string, (v: string) => string> = {
    firstName: validateFirstName,
    lastName: validateLastName,
    password: validatePassword,
    confirmPassword: (v) => (v === password ? '' : 'Passwords do not match.'),
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validators[field](value) }));
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const allFields = { firstName, lastName, password, confirmPassword };
    const newErrors: Record<string, string> = {};
    (Object.entries(allFields) as [string, string][]).forEach(([field, value]) => {
      const err = validators[field](value);
      if (err) newErrors[field] = err;
    });
    setTouched({ firstName: true, lastName: true, password: true, confirmPassword: true });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onComplete(firstName, lastName, password);
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Almost there!</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Confirm your name and set a password to finish creating your {BRAND.name} account.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="google-first-name"
            label="First Name"
            value={firstName}
            error={touched.firstName ? errors.firstName : undefined}
            placeholder="Maria"
            autoComplete="given-name"
            onChange={setFirstName}
            onBlur={() => handleBlur('firstName', firstName)}
          />
          <FormField
            id="google-last-name"
            label="Last Name"
            value={lastName}
            error={touched.lastName ? errors.lastName : undefined}
            placeholder="Santos"
            autoComplete="family-name"
            onChange={setLastName}
            onBlur={() => handleBlur('lastName', lastName)}
          />
        </div>

        <FormField
          id="google-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          error={touched.password ? errors.password : undefined}
          placeholder="••••••••"
          autoComplete="new-password"
          onChange={setPassword}
          onBlur={() => handleBlur('password', password)}
          rightSlot={
            <ToggleButton
              show={showPassword}
              onToggle={() => setShowPassword((s) => !s)}
              label={showPassword ? 'Hide password' : 'Show password'}
            />
          }
        />

        <FormField
          id="google-confirm-password"
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          placeholder="••••••••"
          autoComplete="new-password"
          onChange={setConfirmPassword}
          onBlur={() => handleBlur('confirmPassword', confirmPassword)}
          rightSlot={
            <ToggleButton
              show={showConfirm}
              onToggle={() => setShowConfirm((s) => !s)}
              label={showConfirm ? 'Hide password' : 'Show password'}
            />
          }
        />

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full mt-1" disabled={isPending}>
          {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {isPending ? 'Creating account…' : 'Continue'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={isPending}
          onClick={onCancel}
        >
          Back
        </Button>
      </form>
    </div>
  );
}
