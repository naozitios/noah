import Image from "next/image";
import Link from "next/link";
import { Sprout } from "lucide-react";

const linkClass =
  "font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors";

export function IntroCard() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-32 sm:w-32">
          <Image
            src="/images/me.png"
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
            Hey, I&apos;m Noah <span aria-hidden>👋</span>
          </h1>

          <h1 className="text-pretty font-sans text-2xl leading-snug text-foreground sm:text-3xl">
            These are the bets i am making in public! From the{" "}
            <Link href="/products" className={linkClass}>
              products
            </Link>{" "}
            i build to the{" "}
            <Link href="/investments" className={linkClass}>
              investments
            </Link>{" "}
            i make - here i document my thinking, track outcomes, and distill the{" "}
            <Link href="/principles" className={linkClass}>
              principles
            </Link>{" "}
            learnt along the way.
          </h1>

          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Glad you came to visit my digital garden, wander around! 🗺️
          </p>
        </div>
      </div>
    </section>
  );
}
