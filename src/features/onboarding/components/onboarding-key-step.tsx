/**
 * Onboarding · AI-provider key step.
 *
 * Final setup step of the guided wizard. The teacher picks an AI provider and
 * pastes its API key — this is what {@link BRAND.name} uses to generate lesson
 * plans, so it is strongly encouraged (but skippable). Saves via
 * {@link useUpdateProviderKeys}, the same hook the Settings page uses. The key
 * is write-only: the server only returns a masked preview + ``configured`` flag.
 */

import { useState } from "react"
import { AlertTriangle, Eye, EyeOff } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BRAND } from "@/config/branding"
import {
  useProviderKeys,
  useUpdateProviderKeys,
} from "@/features/settings/api/use-api-keys"
import { PROVIDERS, type ProviderId } from "@/features/settings/types"

interface OnboardingKeyStepProps {
  /** Complete onboarding (persists COMPLETED + leaves the wizard). */
  onFinish: () => void
  /** Go back to the previous step (local only). */
  onBack: () => void
  /** True while the step pointer is being persisted by the wizard. */
  isAdvancing: boolean
}

/**
 * AI-provider key step UI.
 *
 * Inputs: reads the masked provider-key status for pre-fill/badges.
 * Outputs: on "Save & finish" it persists the key + active provider (when the
 * teacher typed one or changed provider), then completes onboarding; "Skip"
 * completes without saving.
 * Side effects: triggers {@link useUpdateProviderKeys} on save.
 *
 * @returns The provider-key step form.
 */
export function OnboardingKeyStep({
  onFinish,
  onBack,
  isAdvancing,
}: OnboardingKeyStepProps) {
  const { data, isLoading } = useProviderKeys()
  const mutation = useUpdateProviderKeys()

  const [provider, setProvider] = useState<ProviderId>("gemini")
  const [keyValue, setKeyValue] = useState("")
  const [visible, setVisible] = useState(false)

  // Fall back to the server's active provider until the teacher picks one.
  const activeProvider = data?.activeProvider ?? provider
  const meta = PROVIDERS.find((p) => p.id === provider) ?? PROVIDERS[0]
  const status = data?.keys[provider]
  const typed = keyValue.trim().length > 0
  const configured = status?.configured ?? false
  const isBusy = isLoading || mutation.isPending || isAdvancing

  // Only hit the API when there's an actual change to persist.
  const providerChanged = provider !== activeProvider
  const handleFinish = () => {
    if (!typed && !providerChanged) {
      onFinish()
      return
    }
    mutation.mutate(
      {
        activeProvider: provider,
        ...(typed ? { keys: { [provider]: keyValue.trim() } } : {}),
      },
      { onSuccess: () => onFinish() },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Connect an AI provider</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {BRAND.name} uses your own provider key to generate lesson plans. You can
          add or change this later in Settings.
        </p>
      </div>

      {/* Provider selector */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="onboarding-provider" className="text-sm font-medium">
          Provider
        </Label>
        <Select
          value={provider}
          onValueChange={(v) => {
            setProvider(v as ProviderId)
            setKeyValue("")
          }}
          disabled={isBusy}
        >
          <SelectTrigger id="onboarding-provider" className="w-full">
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key input */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="onboarding-key" className="text-sm font-medium">
              {meta.label} API key
            </Label>
            {!isLoading && (
              <Badge variant={configured ? "default" : "outline"} className="text-xs">
                {configured ? "Configured" : "Not set"}
              </Badge>
            )}
          </div>
          <a
            href={meta.consoleUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-primary hover:underline"
          >
            Get your key →
          </a>
        </div>
        <div className="relative">
          <Input
            id="onboarding-key"
            type={visible ? "text" : "password"}
            value={keyValue}
            placeholder={
              configured && status?.preview
                ? `Current: ${status.preview}`
                : meta.keyPlaceholder
            }
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setKeyValue(e.target.value)}
            disabled={isBusy}
            className="h-9 pr-10 text-sm"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide API key" : "Show API key"}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Amber hint when the chosen provider has no key yet. */}
      {!configured && !typed && !isLoading && (
        <div className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/20 px-3 py-2.5 text-xs text-accent-foreground">
          <AlertTriangle className="mt-px size-3.5 shrink-0" />
          <span>
            Without a key you can finish setup, but you'll need to add one before
            generating a lesson plan.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isBusy}>
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onFinish} disabled={isBusy}>
            Skip for now
          </Button>
          <Button type="button" onClick={handleFinish} disabled={isBusy}>
            {isBusy ? "Finishing…" : "Save & finish"}
          </Button>
        </div>
      </div>
    </div>
  )
}
