/**
 * BrandLogo — shared TeachOS logo mark + wordmark.
 *
 * Renders the brand icon (BookOpen in a blue rounded box) beside the product
 * name. Used by the landing navbar, landing footer, and the authenticated
 * DashboardNav so all three render one consistent mark.
 *
 * @param size       - "sm" (28px icon box) or "md" (32px icon box, default).
 * @param showLabel  - Whether to render the wordmark next to the icon (default true).
 */

import { BookOpen } from "lucide-react"
import { BRAND } from "@/config/branding"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  size?: "sm" | "md"
  showLabel?: boolean
  className?: string
}

export function BrandLogo({
  size = "md",
  showLabel = true,
  className,
}: BrandLogoProps) {
  const boxSize = size === "sm" ? "size-7" : "size-8"
  const iconSize = size === "sm" ? "size-3.5" : "size-4"
  const textSize = size === "sm" ? "text-lg" : "text-xl"

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0",
          boxSize,
        )}
      >
        <BookOpen className={iconSize} />
      </span>
      {showLabel && (
        <span className={cn("font-bold text-primary", textSize)}>
          {BRAND.name}
        </span>
      )}
    </span>
  )
}
