/**
 * Settings · API-keys domain model.
 *
 * Shared types and provider metadata for the AI-provider API-key configuration
 * section. Types mirror the backend ``/settings/provider-keys`` contract so the
 * seam in {@link useProviderKeys} / {@link useUpdateProviderKeys} can be typed
 * end-to-end without a separate codegen step.
 */

/** Supported AI providers. Must match the backend ``ProviderId`` StrEnum values. */
export type ProviderId = "grok" | "gemini"

/** Static, display-time metadata for a provider (label, hints, console link). */
export interface ProviderMeta {
  /** Stable identifier used as the storage/record key. */
  id: ProviderId
  /** Human-readable name shown in the UI. */
  label: string
  /** Example key shape, used as the input placeholder. */
  keyPlaceholder: string
  /** External page where the user can generate/copy their key. */
  consoleUrl: string
}

/**
 * Provider catalogue. Order here drives render order in the form.
 * Add a provider by appending an entry (and extending {@link ProviderId}).
 */
export const PROVIDERS: ProviderMeta[] = [
  {
    id: "gemini",
    label: "Google Gemini",
    keyPlaceholder: "AIza…",
    consoleUrl: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "grok",
    label: "Grok (xAI)",
    keyPlaceholder: "xai-…",
    consoleUrl: "https://console.x.ai/",
  },
]

/**
 * Masked status for a single provider as returned by the backend.
 * The raw key is never exposed — only a masked preview (e.g. ``"••••1a2b"``)
 * and a boolean indicating whether a key is stored.
 */
export interface ProviderKeyStatus {
  /** True when a key is stored for this provider. */
  configured: boolean
  /** Masked preview (e.g. ``"••••1a2b"``), or null when not configured. */
  preview: string | null
}

/**
 * Response shape from GET/PATCH ``/settings/provider-keys``.
 * Matches the backend ``ProviderKeysResponse`` camelCase schema.
 */
export interface ProviderKeysResponse {
  /** The provider currently selected for generation. */
  activeProvider: ProviderId
  /** Masked key status per provider. */
  keys: Record<ProviderId, ProviderKeyStatus>
}

/**
 * PATCH body for ``/settings/provider-keys``.
 * All fields are optional — partial map. For ``keys``:
 * - Non-empty string → upsert that provider's key.
 * - Empty string ``""`` → clear/delete that provider's key.
 * - Provider omitted → left unchanged.
 */
export interface ProviderKeysUpdate {
  activeProvider?: ProviderId
  keys?: Partial<Record<ProviderId, string>>
}
