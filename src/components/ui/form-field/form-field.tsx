import { Label } from "../label/label";
import { Input } from "../input/input";
import { cn } from "@/utils/cn";


/* -------------------------------------------------------------------------- */
/*  Reusable field component                                                    */
/* -------------------------------------------------------------------------- */

interface FieldProps {
    id: string
    label: string
    type?: string
    value: string
    error?: string
    placeholder?: string
    autoComplete?: string
    onChange: (v: string) => void
    onBlur?: () => void
    rightSlot?: React.ReactNode
  }

  
export function FormField({
    id, label, type = "text", value, error, placeholder, autoComplete,
    onChange, onBlur, rightSlot,
  }: FieldProps) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              "h-9 text-sm",
              error && "border-destructive focus-visible:ring-destructive",
              rightSlot && "pr-10"
            )}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightSlot}
            </div>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
  