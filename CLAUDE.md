<project-context>

**Purpose:** `teacher-os-fe` is the web frontend for **TeachOS** — a platform for
Filipino teachers. The product brand is **TeachOS** everywhere in UI and copy. **ILAW**
is the DepEd/MATATAG lesson-plan *format* that TeachOS generates; it is not the product
name. The MVP feature is ILAW-format lesson-plan generation. The marketing landing page and authentication flows
are implemented and **live end-to-end**: the login/register forms
([src/features/auth/components/](src/features/auth/components/)) are wired to the
`useLogin`/`useRegister` hooks (email/password) **and** to dedicated Google OAuth
buttons (`useGoogleLogin` / `useGoogleSignup` in
[src/features/auth/api/use-google-auth.ts](src/features/auth/api/use-google-auth.ts)).
The auth page ([src/app/routes/auth/auth.tsx](src/app/routes/auth/auth.tsx)) renders
a "Sign in with Google" button above the login form and a "Sign up with Google" button
above the register form; brand-new Google accounts trigger an inline name-confirmation
step ([src/features/auth/components/google-name-step.tsx](src/features/auth/components/google-name-step.tsx))
before the backend row is created. The authenticated app area is enabled —
`/app` (protected) renders a minimal shell + dashboard
([src/app/routes/app/](src/app/routes/app/)); `/generate` hosts the lesson-plan
wizard, `/plans/:id` ([src/app/routes/app/plan-detail.tsx](src/app/routes/app/plan-detail.tsx))
shows a saved plan (reusing `StepResult`), and `/settings`
([src/app/routes/app/settings.tsx](src/app/routes/app/settings.tsx),
reachable from the user menu in DashboardNav) hosts user configuration — two sections:
(1) **School Information** ([src/features/settings/components/school-info-section.tsx](src/features/settings/components/school-info-section.tsx))
lets teachers save their DepEd school header fields (school name, region, division, district,
address) via `PATCH /auth/user` (`useUpdateProfile` in
[src/features/settings/api/use-update-profile.ts](src/features/settings/api/use-update-profile.ts));
these populate the header block in exported DOCX lesson plans. (2) **AI Provider API Keys** (Grok/Gemini)
live in [src/features/settings/](src/features/settings/) and persist via
`GET`/`PATCH /settings/provider-keys` (masked/write-only — the raw key is never returned,
only a ``configured`` flag and masked preview).

**Lesson-plan generation + export (live end-to-end):** the `/generate` wizard calls the real
`POST /lesson-plans` endpoint via `useGenerateLessonPlan`
([src/features/generate/api/use-generate-lesson-plan.ts](src/features/generate/api/use-generate-lesson-plan.ts));
the former local `mock-generator.ts` is removed. **Grade levels and subjects are now DB-backed**
(no longer hardcoded in [step-lesson-details.tsx](src/features/generate/components/step-lesson-details.tsx)):
`useGradeLevels` / `useSubjects` ([src/features/generate/api/use-curriculum.ts](src/features/generate/api/use-curriculum.ts))
fetch `GET /curriculum/grade-levels` and `/curriculum/grade-levels/{code}/subjects`
(TanStack Query, `staleTime: Infinity`). Step 1 populates the Grade Level dropdown from the API
(Grade 1-12), then loads that grade's subjects on demand (subject select is disabled until a grade
is picked, and clears when the grade changes). SHS subjects are grouped by track → cluster → subjects:
a "Core Subjects" group, then per track a track-level `SelectGroup` header containing nested cluster
`SelectGroup`s with their elective subjects as `SelectItem`s. K-10 subjects render as a flat list.
The request/lesson-plan contract field is still called `learningArea` (unchanged); only the visible
Step 1 label reads "Subject" and the Step 3 review reads "Subject". `GradeLevel` / `Subject` types
live in [src/features/generate/types.ts](src/features/generate/types.ts); `Subject` carries a
nullable `cluster: { id; name; track }` field. Before generating, the review step is gated on
the active provider having a key configured (reads `useProviderKeys`; shows an amber
"Add one in Settings" notice and disables Generate otherwise). The dashboard
([src/app/routes/app/dashboard.tsx](src/app/routes/app/dashboard.tsx)) lists saved plans via
`useLessonPlans` and supports open (→ `/plans/:id`) and delete (`useDeleteLessonPlan`); list/detail/
delete hooks live in [src/features/generate/api/use-lesson-plans.ts](src/features/generate/api/use-lesson-plans.ts).
The `/lesson-plans` request/record types sit in
[src/features/generate/types.ts](src/features/generate/types.ts). **DOCX and PDF export** are both available via buttons in `StepResult`. Both call
`useExportLessonPlan(format)` from
([src/features/generate/api/use-export-lesson-plan.ts](src/features/generate/api/use-export-lesson-plan.ts)),
which accepts `format: "docx" | "pdf"` (default `"docx"`). DOCX POSTs to
`POST /lesson-plans/{id}/export`; PDF POSTs to `POST /lesson-plans/{id}/export/pdf`. Both
use `responseType: "blob"` and trigger a browser download (`.docx` / `.pdf` extension). `StepResult`
instantiates two separate mutation hooks (`exportDocx` / `exportPdf`) so each has its own pending
state. `StepResult` requires a `planId` prop (threaded from `generate.tsx` via the generate response
`id`, and from `plan-detail.tsx` via `data.id`).
The `User` type ([src/types/api.ts](src/types/api.ts)) now includes five school fields
(`schoolName`, `region`, `division`, `district`, `schoolAddress`) and an `onboardingStep`
(`OnboardingStep` union: `WELCOME`/`SCHOOL_INFO`/`PROVIDER_KEY`/`COMPLETED`). The shared Axios error
interceptor now surfaces FastAPI's `detail` field (then `message`). The hooks
([src/features/settings/api/use-api-keys.ts](src/features/settings/api/use-api-keys.ts))
use TanStack Query v5 (`useProviderKeys` / `useUpdateProviderKeys`) over the shared Axios
client. No `localStorage` is used for keys. Registration has **no team concept**.
Discussions/users/profile routes are intentionally not built yet.

**Feedback + onboarding (live end-to-end):** Two protected features were added.
(1) **Feedback** — a dedicated **`/feedback`** route ([src/app/routes/app/feedback.tsx](src/app/routes/app/feedback.tsx))
renders `FeedbackForm` ([src/features/feedback/](src/features/feedback/components/feedback-form.tsx))
with a category `Select`, an optional 1–5 star rating, and a required message; submits via
`useSubmitFeedback` ([src/features/feedback/api/use-submit-feedback.ts](src/features/feedback/api/use-submit-feedback.ts))
→ `POST /feedback`, showing a success toast and returning to the dashboard. Reached from a new
**"Send feedback"** item in the DashboardNav user dropdown
([src/components/layouts/dashboard-nav.tsx](src/components/layouts/dashboard-nav.tsx)).
(2) **Onboarding** — a guided first-time **setup wizard** at **`/onboarding`**
([src/app/routes/app/onboarding.tsx](src/app/routes/app/onboarding.tsx)) with three steps
(welcome → school info → AI provider key), built in
[src/features/onboarding/](src/features/onboarding/components/onboarding-wizard.tsx) and reusing the
existing `useUpdateProfile` / `useProviderKeys` / `useUpdateProviderKeys` hooks for the data-entry
steps. Progress is **resumable**: each forward transition persists the current step name via
`useUpdateOnboardingStep` ([src/features/onboarding/api/use-update-onboarding-step.ts](src/features/onboarding/api/use-update-onboarding-step.ts))
→ `PATCH /auth/onboarding`, written straight into the auth cache with `setQueryData(USER_QUERY_KEY, …)`.
A new **`RequireOnboarded`** guard in [src/lib/auth.tsx](src/lib/auth.tsx) (used *inside* `ProtectedRoute`
on dashboard/generate/settings/plan-detail/feedback in [src/app/router.tsx](src/app/router.tsx))
redirects any user whose `onboardingStep !== 'COMPLETED'` to `/onboarding`; the `/onboarding` route
itself is *not* wrapped (it would loop) and redirects already-completed users back to `/app`.
The previously-unmounted Zustand toast `<Notifications/>` is now mounted once in
[src/app/provider.tsx](src/app/provider.tsx), so success/error toasts (feedback, onboarding saves, and
the Axios error interceptor) actually render.

**Design system:** the app follows the **TeachOS Design System** — deep-blue primary,
amber accent reserved for "needs attention"/placeholder UI only, 8px (`rounded-lg`)
canonical radius. Brand name and tagline are centralised in
[src/config/branding.ts](src/config/branding.ts); the shared logo mark is
[src/components/brand/brand-logo.tsx](src/components/brand/brand-logo.tsx). Tokens live
in [src/index.css](src/index.css); the full reference (palette, typography,
badge/status patterns, TopNav) is in [design-system.md](design-system.md) —
**read it before building or restyling UI.**

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
  exposes `useUser`/`useLogin`/`useRegister`/`useLogout`/`AuthLoader`. Google OAuth
  primitives (`googleLogin`, `googleSignupStart`, `googleSignupComplete`,
  `cancelGoogleSignup`) and `USER_QUERY_KEY` are also exported from `auth.tsx`; the
  controller hooks (`useGoogleLogin`, `useGoogleSignup`) live in
  [src/features/auth/api/use-google-auth.ts](src/features/auth/api/use-google-auth.ts)
  and update the react-query-auth cache directly via `setQueryData(USER_QUERY_KEY, user)`.
  Route guards live in the same file: `ProtectedRoute` redirects unauthenticated users to
  login (preserving `redirectTo`); `PublicRoute` redirects already-authenticated users to
  `/app`, honoring any `redirectTo` query param. Both return `null` while the auth check
  is in-flight to avoid flash redirects. Auth routes (`/auth/login`, `/auth/register`)
  are wrapped with `PublicRoute` in the router using `React.lazy` + element syntax.
- **API client** ([src/lib/api-client.ts](src/lib/api-client.ts)): a shared Axios
  instance whose response interceptor unwraps `response.data`, pushes errors to the
  Zustand notifications store, and redirects to login on `401`.
- **Config**: env vars (prefixed `VITE_TEACHER_OS_`) are stripped and validated through
  Zod in [src/config/env.ts](src/config/env.ts); all routes/URLs are centralized with
  `getHref` helpers in [src/config/paths.ts](src/config/paths.ts).

**Project structure (feature-based, "bulletproof-react" style):**
- `src/app/` – app shell: `provider`, `router`, and route components under `routes/`
- `src/features/<feature>/` – feature modules (e.g. `auth/components`, `auth/api`); add new domains here
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
