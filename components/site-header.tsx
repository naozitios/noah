"use client"

import { Home, Package, TrendingUp, BookOpen, Lightbulb, Moon, Sun, Link2, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PageId } from "@/lib/garden-data"
import { useTheme } from "next-themes"
import { useNavIndicator } from "@/hooks/use-nav-indicator"
import { useState } from "react"

const navLinks: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
  { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { id: "investments", label: "Investments", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "principles", label: "Principles", icon: <BookOpen className="h-4 w-4" /> },
  { id: "assumptions", label: "Assumptions", icon: <Lightbulb className="h-4 w-4" /> },
]

export function SiteHeader({
  activePage,
  onNavigate,
}: {
  activePage: PageId
  onNavigate: (page: PageId) => void
}) {
  const { theme, setTheme } = useTheme()
  const { navRef, indicator } = useNavIndicator(activePage)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex items-center border-b border-border bg-background px-4 sm:px-6">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="sm:hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div ref={navRef} className="relative hidden sm:flex items-center gap-1 py-2 sm:py-2.5">
        <div
          className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
        {navLinks.map((link) => (
          <button
            key={link.id}
            data-page={link.id}
            onClick={() => onNavigate(link.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors duration-300 sm:px-3",
              activePage === link.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.icon}
            <span className="hidden sm:inline">{link.label}</span>
          </button>
        ))}
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-border bg-background sm:hidden z-50">
          <div className="flex flex-col py-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id)
                  setMobileMenuOpen(false)
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  activePage === link.id
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        <a href="https://www.linkedin.com/in/noah-teo/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg> LinkedIn
        </a>
        <a href="https://github.com/naozitios" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg> GitHub
        </a>
        <a href="/uploads/NoahTeo.pdf" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground" target="_blank" rel="noreferrer">
          <Link2 className="h-3.5 w-3.5" /> CV
        </a>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg border border-border bg-background p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 hidden dark:block" />
          <Moon className="h-4 w-4 block dark:hidden" />
        </button>
      </div>
    </header>
  )
}
