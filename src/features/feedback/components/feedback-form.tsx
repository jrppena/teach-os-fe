/**
 * Feedback · form.
 *
 * Lets an authenticated teacher send product feedback: a category, an optional
 * 1–5 star rating, and a required message. Uses the plain-state + manual
 * validation pattern of the auth forms (no form library). Submits via
 * {@link useSubmitFeedback}; on success it resets and returns to the dashboard.
 */

import { useState } from "react"
import { Send, Star } from "lucide-react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { paths } from "@/config/paths"
import { useSubmitFeedback } from "@/features/feedback/api/use-submit-feedback"
import {
  FEEDBACK_CATEGORIES,
  type FeedbackCategory,
} from "@/features/feedback/types"
import { cn } from "@/lib/utils"
import { validateRequired } from "@/utils/validators"

const validateMessage = validateRequired("Message")

/**
 * Controlled feedback form.
 *
 * Inputs: none (reads/writes its own local state).
 * Outputs: on a valid submit, POSTs the feedback and navigates back to /app.
 * Side effects: triggers the {@link useSubmitFeedback} mutation.
 *
 * @returns The feedback form UI.
 */
export function FeedbackForm() {
  const navigate = useNavigate()
  const mutation = useSubmitFeedback()

  const [category, setCategory] = useState<FeedbackCategory>("GENERAL")
  const [rating, setRating] = useState<number>(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)

  const isBusy = mutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const messageError = validateMessage(message)
    setTouched(true)
    setError(messageError)
    if (messageError) return

    mutation.mutate(
      {
        category,
        // Omit rating when the teacher didn't pick one (0 = unset).
        rating: rating > 0 ? rating : undefined,
        message: message.trim(),
      },
      {
        onSuccess: () => navigate(paths.app.dashboard.getHref()),
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="feedback-category" className="text-sm font-medium">
          What is your feedback about?
        </Label>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as FeedbackCategory)}
          disabled={isBusy}
        >
          <SelectTrigger id="feedback-category" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {FEEDBACK_CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Optional rating */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">
          How would you rate your experience?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value === rating ? 0 : value)}
              disabled={isBusy}
              className="rounded p-0.5 text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star
                className={cn(
                  "size-6",
                  value <= rating && "fill-accent text-accent",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="feedback-message" className="text-sm font-medium">
          Your message
        </Label>
        <Textarea
          id="feedback-message"
          value={message}
          placeholder="Tell us what's working well, what's not, or what you'd like to see…"
          rows={6}
          maxLength={2000}
          aria-invalid={!!error}
          aria-describedby={error ? "feedback-message-error" : undefined}
          onChange={(e) => {
            setMessage(e.target.value)
            if (touched) setError(validateMessage(e.target.value))
          }}
          onBlur={() => {
            setTouched(true)
            setError(validateMessage(message))
          }}
          disabled={isBusy}
          className={cn(error && "border-destructive focus-visible:ring-destructive")}
        />
        {error && (
          <p id="feedback-message-error" role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(paths.app.dashboard.getHref())}
          disabled={isBusy}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isBusy}>
          <Send data-icon="inline-start" />
          {isBusy ? "Sending…" : "Send feedback"}
        </Button>
      </div>
    </form>
  )
}
