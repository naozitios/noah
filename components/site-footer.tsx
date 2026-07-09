import { Sprout } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border pt-4 sm:mt-16 sm:pt-5">
      <div className="flex items-center gap-2 text-primary">
        <Sprout className="h-4 w-4" aria-hidden />
        <span className="font-sans text-sm text-foreground">Noah&apos;s garden</span>
      </div>
    </footer>
  )
}
