/**
 * Settings · API-keys domain model.
 *
 * Shared types and provider metadata for the AI-provider API-key configuration
 * section. Scope is intentionally minimal (provider + key only) — no model
 * selection yet. Only Grok (xAI) and Google Gemini are supported for now.
 */

/** Supported AI providers. */
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
 * Persisted API-key configuration: a key per provider plus the provider that
 * generation should use. Keys are kept for every provider so the user can
 * switch the active one without re-entering them.
 */
export interface ApiKeysConfig {
  /** Provider used for generation. */
  activeProvider: ProviderId
  /** Raw API key per provider; empty string means "not set". */
  keys: Record<ProviderId, string>
}

/** Empty starting configuration (Gemini active by default). */
export const DEFAULT_API_KEYS_CONFIG: ApiKeysConfig = {
  activeProvider: "gemini",
  keys: { grok: "", gemini: "" },
}
