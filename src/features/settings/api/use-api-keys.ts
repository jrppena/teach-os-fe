/**
 * Settings · API-keys persistence seam.
 *
 * Reads/writes the AI-provider API-key configuration. For now this is backed by
 * `localStorage` (the backend has no provider-keys endpoint yet) — the same
 * "build the FE against a local mock" approach used by the generate wizard.
 *
 * Note: this module is the single swap point. When the backend lands, replace
 * `loadApiKeys`/`persistApiKeys` (and, ideally, the hook internals) with a
 * TanStack `useQuery`/`useMutation` against GET/PATCH
 * `/users/{uid}/provider-keys`; the `ApiKeysConfig` shape is meant to match it.
 */

import { useCallback, useState } from "react"

import {
  DEFAULT_API_KEYS_CONFIG,
  type ApiKeysConfig,
  type ProviderId,
} from "@/features/settings/types"

/** localStorage key under which the config is serialized. */
const STORAGE_KEY = "teacher-os:api-keys"

/**
 * Narrow unknown parsed JSON into a valid {@link ApiKeysConfig}, falling back to
 * defaults for any missing/invalid field so a corrupt entry can't break the UI.
 */
function normalize(raw: unknown): ApiKeysConfig {
  if (typeof raw !== "object" || raw === null) return DEFAULT_API_KEYS_CONFIG

  const value = raw as Partial<ApiKeysConfig>
  const keys = (value.keys ?? {}) as Partial<Record<ProviderId, string>>
  const activeProvider: ProviderId =
    value.activeProvider === "grok" || value.activeProvider === "gemini"
      ? value.activeProvider
      : DEFAULT_API_KEYS_CONFIG.activeProvider

  return {
    activeProvider,
    keys: {
      grok: typeof keys.grok === "string" ? keys.grok : "",
      gemini: typeof keys.gemini === "string" ? keys.gemini : "",
    },
  }
}

/**
 * Load the saved configuration from `localStorage`.
 *
 * @returns The persisted config, or {@link DEFAULT_API_KEYS_CONFIG} when nothing
 *   is stored or the stored value is unreadable.
 */
// TODO(backend): replace with GET /users/{uid}/provider-keys.
function loadApiKeys(): ApiKeysConfig {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? normalize(JSON.parse(stored)) : DEFAULT_API_KEYS_CONFIG
  } catch {
    return DEFAULT_API_KEYS_CONFIG
  }
}

/**
 * Persist the configuration to `localStorage`.
 *
 * @param config - The configuration to store.
 * @returns Nothing. Failures (e.g. storage disabled) are swallowed silently.
 */
// TODO(backend): replace with PATCH /users/{uid}/provider-keys.
function persistApiKeys(config: ApiKeysConfig): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // Ignore — storage may be unavailable (private mode, quota, etc.).
  }
}

/** Result of {@link useApiKeys}. */
interface UseApiKeysResult {
  /** Currently persisted configuration (defaults until hydrated). */
  config: ApiKeysConfig
  /** True once the initial `localStorage` read has completed. */
  isLoaded: boolean
  /** Persist a new configuration and update local state. */
  save: (next: ApiKeysConfig) => void
}

/**
 * React hook exposing the persisted API-key configuration and a `save` action.
 *
 * This is a client-only SPA, so the persisted config is read once during lazy
 * state initialization — the first render already reflects storage (no
 * hydration effect, no flash).
 *
 * @returns `{ config, isLoaded, save }`.
 */
export function useApiKeys(): UseApiKeysResult {
  const [config, setConfig] = useState<ApiKeysConfig>(loadApiKeys)

  const save = useCallback((next: ApiKeysConfig) => {
    persistApiKeys(next)
    setConfig(next)
  }, [])

  // `isLoaded` is always true today; kept on the interface so the eventual
  // backend swap (an async useQuery) can report real loading state without
  // changing callers.
  return { config, isLoaded: true, save }
}
