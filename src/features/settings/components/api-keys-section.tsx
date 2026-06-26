/**
 * Settings · AI-provider API keys section.
 *
 * Lets a teacher store an API key for each supported provider (Grok, Gemini)
 * and choose which one generation should use. Keys are write-only — the server
 * never returns raw keys, only a masked preview (e.g. "••••1a2b") and a
 * ``configured`` flag. Edits are staged locally and only submitted on Save.
 *
 * Data flows through {@link useProviderKeys} (GET) and
 * {@link useUpdateProviderKeys} (PATCH) via TanStack Query.
 */

import { useState } from "react"
import { AlertTriangle, Check, Eye, EyeOff } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import {
  useProviderKeys,
  useUpdateProviderKeys,
} from "@/features/settings/api/use-api-keys"
import { PROVIDERS, type ProviderId } from "@/features/settings/types"

/** Per-provider show/hide flags for the key inputs. */
type Visibility = Record<ProviderId, boolean>
/** Per-provider typed-in draft values (empty = unchanged / not yet entered). */
type KeyDraft = Partial<Record<ProviderId, string>>

const HIDDEN: Visibility = { grok: false, gemini: false }

/**
 * Editable form for the AI-provider API-key configuration.
 *
 * Drives loading and disabled state from the TanStack Query result. Shows a
 * "Configured" / "Not set" badge per provider from the server's ``configured``
 * flag and the masked ``preview`` as a description hint below each input.
 * The input itself starts empty — a typed value replaces the stored key on Save.
 *
 * @returns The settings section UI.
 */
export function ApiKeysSection() {
  const { data, isLoading } = useProviderKeys()
  const mutation = useUpdateProviderKeys()

  const [draftProvider, setDraftProvider] = useState<ProviderId | undefined>(
    undefined,
  )
  const [draftKeys, setDraftKeys] = useState<KeyDraft>({})
  const [visibility, setVisibility] = useState<Visibility>(HIDDEN)
  const [justSaved, setJustSaved] = useState(false)

  // Resolve display values: fall back to server data while no draft exists.
  const activeProvider: ProviderId = draftProvider ?? data?.activeProvider ?? "gemini"

  const providerChanged = draftProvider !== undefined && draftProvider !== data?.activeProvider
  const hasKeyEdits = Object.values(draftKeys).some((v) => v !== undefined)
  const isDirty = providerChanged || hasKeyEdits

  const updateKeyDraft = (id: ProviderId, value: string) => {
    setDraftKeys((prev) => ({ ...prev, [id]: value }))
    setJustSaved(false)
  }

  const setActiveProvider = (id: ProviderId) => {
    setDraftProvider(id)
    setJustSaved(false)
  }

  const toggleVisibility = (id: ProviderId) =>
    setVisibility((v) => ({ ...v, [id]: !v[id] }))

  const handleSave = () => {
    const body: Parameters<typeof mutation.mutate>[0] = {
      activeProvider: activeProvider,
    }

    // Build the keys map: only include providers where the user typed something.
    // A non-empty trimmed value → upsert. An empty string → clear.
    const keysToSend: Partial<Record<ProviderId, string>> = {}
    for (const [id, raw] of Object.entries(draftKeys) as [ProviderId, string][]) {
      if (raw !== undefined) {
        keysToSend[id] = raw.trim()
      }
    }
    if (Object.keys(keysToSend).length > 0) {
      body.keys = keysToSend
    }

    mutation.mutate(body, {
      onSuccess: () => {
        // Clear drafts — the query will refetch the latest masked state.
        setDraftProvider(undefined)
        setDraftKeys({})
        setJustSaved(true)
      },
    })
  }

  // Active-provider key is "missing" when neither the server confirms it's
  // configured nor the user has typed a (non-empty) draft value for it.
  const serverConfigured = data?.keys[activeProvider]?.configured ?? false
  const draftHasValue = (draftKeys[activeProvider] ?? "").trim().length > 0
  const activeKeyMissing = !serverConfigured && !draftHasValue

  const isBusy = isLoading || mutation.isPending

  return (
    <div className="flex flex-col gap-6">
      {/* Active provider selector */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="active-provider" className="text-sm font-medium">
          Active provider
        </Label>
        <p className="text-xs text-muted-foreground">
          The provider ILAW uses to generate your lesson plans.
        </p>
        <Select
          value={activeProvider}
          onValueChange={(v) => setActiveProvider(v as ProviderId)}
          disabled={isBusy}
        >
          <SelectTrigger id="active-provider" className="w-full">
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Per-provider API keys */}
      <div className="flex flex-col gap-5">
        {PROVIDERS.map((provider) => {
          const isActive = provider.id === activeProvider
          const status = data?.keys[provider.id]
          const typedValue = draftKeys[provider.id] ?? ""
          const visible = visibility[provider.id]
          const inputId = `key-${provider.id}`

          return (
            <div key={provider.id} className="flex flex-col gap-1.5">
              {/* Label row: name + active/configured badges, with a "get key" link */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={inputId} className="text-sm font-medium">
                    {provider.label} API key
                  </Label>
                  {isActive && <Badge variant="secondary">Active</Badge>}
                  {!isLoading && (
                    <Badge
                      variant={status?.configured ? "default" : "outline"}
                      className="text-xs"
                    >
                      {status?.configured ? "Configured" : "Not set"}
                    </Badge>
                  )}
                </div>
                <a
                  href={provider.consoleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Get your key →
                </a>
              </div>

              {/* Masked input — starts empty; typed value replaces the stored key */}
              <div className="relative">
                <Input
                  id={inputId}
                  type={visible ? "text" : "password"}
                  value={typedValue}
                  placeholder={
                    status?.configured && status.preview
                      ? `Current: ${status.preview}`
                      : provider.keyPlaceholder
                  }
                  autoComplete="off"
                  spellCheck={false}
                  className="h-9 pr-10 text-sm"
                  onChange={(e) => updateKeyDraft(provider.id, e.target.value)}
                  disabled={isBusy}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(provider.id)}
                  aria-label={visible ? "Hide API key" : "Show API key"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {visible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Needs-attention hint when the active provider has no key (amber). */}
      {activeKeyMissing && !isLoading && (
        <div className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/20 px-3 py-2.5 text-xs text-accent-foreground">
          <AlertTriangle className="mt-px size-3.5 shrink-0" />
          <span>
            Add a key for your active provider to enable lesson-plan generation.
          </span>
        </div>
      )}

      <Separator />

      {/* Save row with inline status (no toast — keeps feedback self-contained) */}
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-xs text-muted-foreground"
          aria-live="polite"
          role="status"
        >
          {isDirty ? (
            "You have unsaved changes."
          ) : justSaved ? (
            <span className="inline-flex items-center gap-1 text-foreground">
              <Check className="size-3.5" /> Changes saved
            </span>
          ) : (
            ""
          )}
        </p>
        <Button onClick={handleSave} disabled={!isDirty || isBusy}>
          {mutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
