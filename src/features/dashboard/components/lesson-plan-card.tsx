// Lesson-plan card for the dashboard grid (ILAW design system).
// Presents a single lesson plan's status, completion, placeholder-attention
// state, and quick actions (edit / export / delete). Purely presentational —
// all data and action handlers are passed in by the parent.

import {
  BookOpen,
  Calendar,
  Circle,
  Download,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Lesson-plan lifecycle states, per the ILAW status-badge spec.
export type LessonPlanStatus = "DRAFT" | "GENERATED" | "COMPLETED" | "ARCHIVED"

// Tailwind classes (+ status-dot color) for each lifecycle state.
const STATUS_STYLES: Record<LessonPlanStatus, { badge: string; dot: string }> = {
  DRAFT: {
    badge: "bg-muted text-muted-foreground border border-border",
    dot: "text-muted-foreground",
  },
  GENERATED: {
    badge: "bg-primary/10 text-primary border border-primary/20",
    dot: "text-primary",
  },
  COMPLETED: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "text-emerald-600",
  },
  ARCHIVED: {
    badge: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "text-slate-400",
  },
}

export interface LessonPlan {
  id: string
  title: string
  subject: string
  quarter: string
  status: LessonPlanStatus
  progress: number
  progressLabel: string
  updatedLabel: string
  placeholderCount: number
}

interface LessonPlanCardProps {
  plan: LessonPlan
  onEdit?: (id: string) => void
  onExport?: (id: string) => void
  onDelete?: (id: string) => void
}

/**
 * Dashboard lesson-plan card.
 *
 * @param plan - The lesson plan to render (status, completion, metadata).
 * @param onEdit - Invoked with the plan id when the user chooses "Edit".
 * @param onExport - Invoked with the plan id when the user chooses "Export PDF".
 * @param onDelete - Invoked with the plan id when the user chooses "Delete".
 * @returns A card with status badge, placeholder callout, progress, and actions.
 */
export function LessonPlanCard({ plan, onEdit, onExport, onDelete }: LessonPlanCardProps) {
  const style = STATUS_STYLES[plan.status]
  const hasPlaceholders = plan.placeholderCount > 0

  return (
    <Card className="group flex flex-col border-border shadow-sm transition-shadow duration-150 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Badge className={cn(style.badge, "shrink-0 text-[10px] font-semibold")}>
            <Circle
              className={cn("mr-1 fill-current", style.dot)}
              style={{ width: 5, height: 5 }}
            />
            {plan.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Card actions"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(plan.id)}>
                <Pencil data-icon="inline-start" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport?.(plan.id)}>
                <Download data-icon="inline-start" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(plan.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 data-icon="inline-start" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="mt-1 text-base font-semibold leading-snug text-balance">
          {plan.title}
        </CardTitle>
        <CardDescription className="mt-0.5 flex items-center gap-1 text-xs">
          <BookOpen className="size-3" aria-hidden />
          {plan.subject} · {plan.quarter}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pb-3">
        {hasPlaceholders && (
          <div className="flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/20 px-2.5 py-1.5">
            <Sparkles className="size-3 shrink-0 text-accent-foreground" aria-hidden />
            <span className="text-[11px] font-medium text-accent-foreground">
              {plan.placeholderCount} placeholder
              {plan.placeholderCount !== 1 ? "s" : ""} need your input
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Completion
            </span>
            <span className="text-[10px] text-muted-foreground">{plan.progressLabel}</span>
          </div>
          <Progress value={plan.progress} className="h-1.5" aria-label={plan.progressLabel} />
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex items-center justify-between pt-3 pb-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="size-3" aria-hidden />
          <span>{plan.updatedLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Edit plan"
                onClick={() => onEdit?.(plan.id)}
              >
                <Pencil aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit plan</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Export PDF"
                onClick={() => onExport?.(plan.id)}
              >
                <Download aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export PDF</TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  )
}
