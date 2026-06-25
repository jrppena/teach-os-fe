<project-context>

**Purpose:** `teacher-os-fe` is the web frontend for Teacher OS, a SaaS product for
teachers (e.g. lesson planning). The marketing landing page and authentication flows
are implemented and **live end-to-end**: the login/register forms
([src/features/auth/components/](src/features/auth/components/)) are wired to the
`useLogin`/`useRegister` hooks, and the authenticated app area is enabled —
`/app` (protected) renders a minimal shell + dashboard
([src/app/routes/app/](src/app/routes/app/)). Registration has **no team concept**.
Discussions/users/profile routes are intentionally not built yet.

**Tech stack:**
- React 19 + TypeScript + Vite 8 (`@vitejs/plugin-react`)
- Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn/ui (`radix-vega` style, lucide icons)
- TanStack React Query v5 for server state; `react-query-auth` for auth session state
- Firebase Auth (client SDK) for credentials; Zustand for local UI state (notifications)
- Axios for the backend REST API; Zod for schema validation (env + forms)
- react-router v7 (data router); Vitest + Testing Library + jsdom for tests

**Architecture (big picture):**
- Entry: [src/main.tsx](src/main.tsx) → `App` ([src/app/index.tsx](src/app/index.tsx))
  → `AppProvider` ([src/app/provider.tsx](src/app/provider.tsx)) → `AppRouter`
  ([src/app/router.tsx](src/app/router.tsx)).
- `AppProvider` wires global concerns: `QueryClient` (config from
  [src/lib/react-query.ts](src/lib/react-query.ts)), `Suspense`, an `ErrorBoundary`
  with `MainErrorFallback`, React Query Devtools (DEV only), and `AuthLoader`.
- Routing uses `createBrowserRouter` with lazy routes. The `convert()` helper maps a
  route module's `clientLoader`/`clientAction`/`default` into react-router's
  `loader`/`action`/`Component` — define those exports in route files to use data APIs.
- **Auth data flow** ([src/lib/auth.tsx](src/lib/auth.tsx)): Firebase Auth verifies
  credentials client-side; the Firebase ID token is attached as a `Bearer` header on the
  Axios instance. The canonical user record lives in the backend DB — fetched via
  `GET /auth/user/:firebaseUID`, created via `POST /auth/register`. `configureAuth`
  exposes `useUser`/`useLogin`/`useRegister`/`useLogout`/`AuthLoader`; `ProtectedRoute`
  redirects unauthenticated users to login.
- **API client** ([src/lib/api-client.ts](src/lib/api-client.ts)): a shared Axios
  instance whose response interceptor unwraps `response.data`, pushes errors to the
  Zustand notifications store, and redirects to login on `401`.
- **Config**: env vars (prefixed `VITE_TEACHER_OS_`) are stripped and validated through
  Zod in [src/config/env.ts](src/config/env.ts); all routes/URLs are centralized with
  `getHref` helpers in [src/config/paths.ts](src/config/paths.ts).

**Project structure (feature-based, "bulletproof-react" style):**
- `src/app/` – app shell: `provider`, `router`, and route components under `routes/`
- `src/features/<feature>/` – feature modules (e.g. `auth/components`); add new domains here
- `src/components/ui/` – shadcn primitives; each in its own folder with a `index.ts` barrel
- `src/components/{landing,layouts,errors}/` – composed/shared UI
- `src/config/` – `env.ts`, `paths.ts`
- `src/lib/` – cross-cutting infra: `api-client`, `auth`, `firebase-client`, `react-query`
- `src/types/` – shared types (`api.ts`); `src/utils/` – helpers (`cn`, `validators`)
- `src/hooks/` – shared hooks; `src/testing/` – Vitest setup

**Conventions / integration points:**
- Import alias `@/*` → `src/*` (via `vite-tsconfig-paths`).
- Backend REST API base URL from `env.API_URL`; auth bridges Firebase ↔ backend DB.
- Add shadcn components with `npm run ui:add -- <name>` — the
  [scripts/shadcn-add.sh](scripts/shadcn-add.sh) wrapper reorganizes each into
  `src/components/ui/<name>/<name>.tsx` + `index.ts` barrel (don't add them flat).

**Developer workflows:**
- `npm run dev` – Vite dev server on port 3000
- `npm run build` – `tsc -b && vite build`
- `npm run lint` – ESLint
- `npm run preview` – preview built app (port 3000)
- `npm run ui:add -- <component> [-o]` – add + reorganize shadcn components
- Tests: Vitest is configured ([vite.config.ts](vite.config.ts), jsdom, globals,
  setup `src/testing/setup-tests.ts`); run with `npx vitest`.

> Missing information: there is no `test` script in [package.json](package.json) despite
> Vitest being configured, and the `src/testing/setup-tests.ts` setup file referenced by
> [vite.config.ts](vite.config.ts) does not appear to exist yet — please confirm the
> intended test command and setup file location.

</project-context>

### Critical Rules

- When working on this project, prioritize code readability and
  maintainability.
- Keep functions and components small and focused on a single
  responsibility.
- Apply KISS (Keep It Simple, Stupid) and YAGNI (You Aren't Gonna Need It)
  principles.
- Absolutely do not modify any other part of the file except the
  <project-context> section when updating project context.
- Ask clarifying questions before making significant architectural changes.
- Never change the `.env` or configuration files unless explicitly
  instructed.
- When referencing files, include line numbers for specific sections when
  applicable.

### Context Management

- Focus suggestions on the current file and its immediate dependencies.
- Reference other files explicitly when cross-file changes are needed.

### Inline Patterns

- Use `// TODO:` or `# TODO:` to indicate where implementations are needed
- Use `// Example:` or `# Example:` to guide expected output format
- Use `// Note:` or `# Note:` for important constraints and considerations

### Code Style Preferences

- Use consistent naming (camelCase for JS, snake_case for DB).
- Prefer composition over inheritance.
- Add JSDoc for public APIs.
- Always apply docstring.

### On Every Code Change

- Always use context7 MCPs when available.
- Update <project-context> section in the `CLAUDE.md` file to reflect any
  changes in tech stack, project structure, or critical commands.
- Ensure functions and components are grouped logically into specific
  modules, files, or folders based on their purpose.
- In each file or module, include a brief comment at the top summarizing
  its purpose and functionality.
- In each function or component, include a brief comment summarizing its
  purpose, inputs, outputs, and side effects.
- Always handle errors and edge cases gracefully, providing meaningful
  messages or fallbacks.

### If Unsure

- If context is unclear, ask for a specific file to reference and expand
  the example with line-numbered snippets.
