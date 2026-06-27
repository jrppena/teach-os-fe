# TeachOS Design System

The visual language for **TeachOS** — a platform for Filipino teachers, starting with
a DepEd MATATAG-compliant ILAW-format lesson-plan generator. Use this reference when
building pages so components, color usage, and spacing stay consistent.

> **Note on ILAW:** ILAW is the DepEd/MATATAG lesson-plan *format* that TeachOS
> generates. It is not the product name. Use "TeachOS" for the product; use
> "ILAW-format" only when describing the lesson-plan document structure.

Tokens live in [src/index.css](src/index.css); primitives in
[src/components/ui/](src/components/ui/). Stack: React 19 + Vite, Tailwind CSS v4,
shadcn/ui (radix variant), Inter, lucide-react.

> **Dialect note:** this project uses the shadcn **radix** variant. Compose triggers with
> `asChild` (`<DropdownMenuTrigger asChild><Button/></DropdownMenuTrigger>`), **not** the
> Base UI `render={...}` prop. The `Button` supports `data-icon="inline-start"` for icons.

---

## 1. Color palette (5-color system)

Deep-blue primary, warm amber accent (needs-attention **only**), neutral grays.
**Never use amber for decorative or interactive elements** — it signals placeholders /
attention exclusively. Defined as CSS variables in [src/index.css](src/index.css) and
exposed as Tailwind tokens (`bg-primary`, `text-muted-foreground`, …).

| Token | Hex | Use |
|---|---|---|
| `--background` | `#F8FAFD` | Page background |
| `--card` / `--popover` | `#FFFFFF` | Surfaces |
| `--foreground` | `#1A2035` | Body text |
| `--primary` | `#1E40AF` | Primary actions, brand (deep blue 700) |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--secondary` | `#E8EDF7` | Secondary buttons / active nav |
| `--secondary-foreground` | `#1E40AF` | |
| `--muted` | `#F0F3F9` | Subtle backgrounds |
| `--muted-foreground` | `#6B7A99` | Helper text, labels |
| `--accent` | `#FBBF24` | **Needs-attention amber only** |
| `--accent-foreground` | `#78350F` | Text/icons on accent |
| `--border` / `--input` | `#DDE3EE` | Borders, inputs |
| `--ring` | `#6B8CC9` | Focus ring |
| `--destructive` | `#DC2626` | Delete / danger |

Brand scale (for gradients/illustration): `bg-ilaw-blue-{50,100,600,700,800}`.

---

## 2. Typography

Inter for everything. Headings semibold; body regular at 14px with relaxed line-height.
All headings use `text-balance`.

| Role | Classes |
|---|---|
| H1 | `text-3xl font-semibold` |
| H2 | `text-2xl font-semibold` |
| H3 | `text-xl font-semibold leading-snug` |
| H4 | `text-base font-semibold` |
| Body | `text-sm font-normal leading-relaxed` |
| Small / helper | `text-xs text-muted-foreground` |
| Label | `text-xs font-semibold uppercase tracking-wide text-muted-foreground` |

---

## 3. Buttons & badges

**Buttons** ([ui/button](src/components/ui/button)) — primary actions use `default`
(deep blue). `secondary` / `outline` / `ghost` / `destructive` / `link` as usual. The
amber accent CTA (`bg-accent text-accent-foreground`) is reserved for placeholder-fill
prompts. Icons via `<Icon data-icon="inline-start" />`.

**Status badges** ([ui/badge](src/components/ui/badge)) — lesson-plan lifecycle, with a
leading dot (`<Circle className="fill-current …" />`):

| Status | Classes |
|---|---|
| `DRAFT` | `bg-muted text-muted-foreground border border-border` |
| `GENERATED` | `bg-primary/10 text-primary border border-primary/20` |
| `COMPLETED` | `bg-emerald-50 text-emerald-700 border border-emerald-200` |
| `ARCHIVED` | `bg-slate-100 text-slate-500 border border-slate-200` |

The canonical mapping lives in
[`LessonPlanCard`](src/features/dashboard/components/lesson-plan-card.tsx) (`STATUS_STYLES`).
**Amber highlight** marks AI-generated placeholders needing teacher review:
`bg-accent/20 border border-accent/30 text-accent-foreground` (see the compliance notice
in [step-review.tsx](src/features/generate/components/step-review.tsx)).

---

## 4. Spacing, radius & elevation

- **Radius:** `--radius` is `0.5rem`, so **`rounded-lg` = 8px is the canonical corner**
  for cards, buttons, inputs, panels. `rounded-md` ≈ 6px (inputs/selects),
  `rounded-sm` ≈ 5px (inline badges).
- **Elevation:** `shadow-sm` cards/inputs · `shadow-md` hovered cards/dropdowns ·
  `shadow-lg` dialogs/modals.
- **Spacing:** 8px-based Tailwind scale — `gap-2`/`p-2` compact, `gap-4`/`p-4` card
  padding, `gap-6` section spacing, `gap-8` page padding.

---

## 5. Navigation pattern (TopNav)

Implemented in
[dashboard-nav.tsx](src/components/layouts/dashboard-nav.tsx); used by the `/app` shell.

- **Logo:** 32×32 (`size-8`) blue `rounded-lg` box with `BookOpen` icon + "TeachOS" wordmark beside it. Use the shared `<BrandLogo>` component ([src/components/brand/brand-logo.tsx](src/components/brand/brand-logo.tsx)).
- **Nav items:** ghost buttons; active item uses `bg-primary/10 text-primary` (no underlines).
- **User menu:** `Avatar` with initials fallback, name + email in the dropdown label,
  profile / settings / log out items.
- **Bar:** `h-14` (56px), `sticky top-0`, `border-b`, `shadow-sm`.
- **Responsive:** wordmark truncates to "ILAW" `<sm`; nav labels hide `<md`.
