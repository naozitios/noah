import Image from "next/image"
import { Sprout } from "lucide-react"
import { type PageId } from "@/lib/garden-data"

export function IntroCard({ onNavigate }: { onNavigate?: (page: PageId) => void }) {
  const linkClass = "font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors cursor-pointer"

  return (
    <section className="w-full">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-32 sm:w-32">
          <Image
            src="/images/portrait.png"
            alt="Illustrated portrait of Noah"
            fill
            sizes="128px"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-primary">
              <Sprout className="h-4 w-4" aria-hidden />
              <span className="font-medium">Noah&apos;s digital garden</span>
            </div>

          </div>

          <h1 className="text-pretty font-sans text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Hey, I&apos;m Noah{" "}
            <span aria-hidden>👋</span> I research, build, and write about {" "}
              <button onClick={() => onNavigate?.("products")} className={linkClass}>products</button>{", "}
              <button onClick={() => onNavigate?.("investments")} className={linkClass}>businesses</button>
              , and the {" "}
            <button onClick={() => onNavigate?.("principles")} className={linkClass}>principles</button>
            {" "}   behind them.
          </h1>

          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            This garden is where I explore ideas and document my learnings. Some are principles, and some are just {" "}
            <button onClick={() => onNavigate?.("assumptions")} className={linkClass}>assumptions</button> waiting to be proved/ disproved.
            Wander around!
          </p>
        </div>
      </div>
    </section>
  )
}
