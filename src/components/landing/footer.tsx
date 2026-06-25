import { Separator } from "@/components/ui/separator/separator"
import { BookOpen } from "lucide-react"

const links = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <a href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="size-3.5" />
              </div>
              TeachOS
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-assisted lesson planning for Filipino teachers — ILAW-format drafts aligned with MATATAG and DO 003 s. 2026.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} TeachOS. All rights reserved.</p>
          <p className="max-w-md text-center md:text-right leading-relaxed">
            TeachOS is an independent tool and is not officially affiliated with the Department of Education.
          </p>
        </div>
      </div>
    </footer>
  )
}
