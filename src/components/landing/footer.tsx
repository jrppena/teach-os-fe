import { Separator } from "@/components/ui/separator/separator"
import { BrandLogo } from "@/components/brand/brand-logo"
import { BRAND } from "@/config/branding"

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
            <a href="/">
              <BrandLogo size="sm" />
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {BRAND.tagline} Lesson planning first — more tools for Filipino teachers coming soon.
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
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="max-w-md text-center md:text-right leading-relaxed">
            {BRAND.name} is an independent tool and is not officially affiliated with the Department of Education.
          </p>
        </div>
      </div>
    </footer>
  )
}
