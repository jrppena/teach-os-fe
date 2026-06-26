/**
 * Settings · AI-provider API keys section.
 *
 * Lets a teacher store an API key for each supported provider (Grok, Gemini)
 * and choose which one generation should use. Keys are masked by default with a
 * per-field show/hide toggle. Edits are staged in a local draft and only
 * persisted (to `localStorage`, via {@link useApiKeys}) on Save.
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
import { useApiKeys } from "@/features/settings/api/use-api-keys"
import {
  PROVIDERS,
  type ApiKeysConfig,
  type ProviderId,
} from "@/features/settings/types"

/** Per-provider show/hide flags for the masked key inputs. */
type Visibility = Record<ProviderId, boolean>

const HIDDEN: Visibility = { grok: false, gemini: false }

/**
 * Editable form for the AI-provider API-key configuration.
 *
 * Owns a local `draft` of the persisted config so changes can be reviewed and
 * saved together. Renders an active-provider selector plus one masked key field
 * per provider, and surfaces an amber hint when the active provider has no key.
 *
 * @returns The settings section UI.
 */
export function ApiKeysSection() {
  const { config, isLoaded, save } = useApiKeys()

  // Seed the draft from the persisted config (read synchronously on first render).
  const [draft, setDraft] = useState<ApiKeysConfig>(() => config)
  const [visibility, setVisibility] = useState<Visibility>(HIDDEN)
  const [justSaved, setJustSaved] = useState(false)

  const isDirty = JSON.stringify(draft) !== JSON.stringify(config)

  // Stage a draft change; any edit clears the "saved" confirmation.
  const updateDraft = (next: ApiKeysConfig) => {
    setDraft(next)
    setJustSaved(false)
  }

  const setActiveProvider = (id: ProviderId) =>
    updateDraft({ ...draft, activeProvider: id })

  const setKey = (id: ProviderId, value: string) =>
    updateDraft({ ...draft, keys: { ...draft.keys, [id]: value } })

  const toggleVisibility = (id: ProviderId) =>
    setVisibility((v) => ({ ...v, [id]: !v[id] }))

  const handleSave = () => {
    // Persist trimmed keys, and re-seed the draft with the same cleaned value so
    // "unsaved changes" detection settles immediately after saving.
    const cleaned: ApiKeysConfig = {
      ...draft,
      keys: {
        grok: draft.keys.grok.trim(),
        gemini: draft.keys.gemini.trim(),
      },
    }
    save(cleaned)
    setDraft(cleaned)
    setJustSaved(true)
  }

  const activeKeyMissing = !draft.keys[draft.activeProvider].trim()

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
          value={draft.activeProvider}
          onValueChange={(v) => setActiveProvider(v as ProviderId)}
          disabled={!isLoaded}
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
          const isActive = provider.id === draft.activeProvider
          const value = draft.keys[provider.id]
          const visible = visibility[provider.id]
          const inputId = `key-${provider.id}`

          return (
            <div key={provider.id} className="flex flex-col gap-1.5">
              {/* Label row: name + active badge, with a "get key" link */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={inputId} className="text-sm font-medium">
                    {provider.label} API key
                  </Label>
                  {isActive && <Badge variant="secondary">Active</Badge>}
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

              {/* Masked input with a show/hide toggle in the right slot */}
              <div className="relative">
                <Input
                  id={inputId}
                  type={visible ? "text" : "password"}
                  value={value}
                  placeholder={provider.keyPlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-9 pr-10 text-sm"
                  onChange={(e) => setKey(provider.id, e.target.value)}
                  disabled={!isLoaded}
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
      {activeKeyMissing && (
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
        <Button onClick={handleSave} disabled={!isDirty || !isLoaded}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
