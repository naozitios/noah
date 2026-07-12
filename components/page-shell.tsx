"use client"

import { useState, useRef, useEffect } from "react"
import { Home, Package, TrendingUp, BookOpen, Lightbulb, Moon, Sun, AtSign, Link2, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Pillar, type Entry, type PageId } from "@/lib/garden-data"
import { useTheme } from "next-themes"
import { IntroCard } from "@/components/intro-card"
import { GardenBoard } from "@/components/garden-board"
import { SiteFooter } from "@/components/site-footer"

const navLinks: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
  { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { id: "investments", label: "Investments", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "principles", label: "Principles", icon: <BookOpen className="h-4 w-4" /> },
  { id: "assumptions", label: "Assumptions", icon: <Lightbulb className="h-4 w-4" /> },
]

export function PageShell({
  pillars,
  entries,
}: {
  pillars: Pillar[]
  entries: Entry[]
}) {
  const [activePage, setActivePage] = useState<PageId>("home")
  const { theme, setTheme } = useTheme()
  const navRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const activeEl = nav.querySelector(`[data-page="${activePage}"]`) as HTMLElement | null
    if (activeEl) {
      const { offsetLeft, offsetWidth } = activeEl
      setIndicator({ left: offsetLeft, width: offsetWidth })
    }
  }, [activePage])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
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
              onClick={() => setActivePage(link.id)}
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
                    setActivePage(link.id)
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
          <a href="#" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <AtSign className="h-3.5 w-3.5" /> Substack
          </a>
          <a href="#" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <Link2 className="h-3.5 w-3.5" /> GitHub
          </a>
          <a href="/uploads/NoahTeo.pdf" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground" target="_blank">
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

      <main className="flex-1 px-6 pt-3 pb-10 sm:px-10 sm:pt-4 sm:pb-14 lg:px-12 lg:pt-5 lg:pb-16">
        {activePage === "home" ? (
          <>
            <IntroCard onNavigate={setActivePage} />
            <div className="mt-12 sm:mt-16">
              <GardenBoard pillars={pillars} entries={entries} />
            </div>
          </>
        ) : (
          <GardenBoard
            key={activePage}
            pillars={pillars}
            entries={entries}
            initialPillar={activePage}
          />
        )}

        <SiteFooter />
      </main>
    </div>
  )
}
