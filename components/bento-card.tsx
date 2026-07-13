"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Entry } from "@/lib/garden-data";

const statusStyles: Record<string, string> = {
  Active: "bg-primary text-primary-foreground",
  Shipped: "bg-accent text-accent-foreground",
  Sunset: "bg-secondary text-muted-foreground",
};

const HUES = [0, 15, 30, 45, 60, 120, 180, 200, 220, 240, 260, 280, 300, 330];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function gradientFromId(id: string) {
  const seed = hashString(id);
  const h1 = HUES[seed % HUES.length];
  const h2 = (h1 + 30 + ((seed >> 4) % 60)) % 360;
  const h3 = (h2 + 30 + ((seed >> 8) % 60)) % 360;
  return {
    c1: `${h1} 50% 60%`,
    c2: `${h2} 55% 65%`,
    c3: `${h3} 50% 60%`,
  };
}

export function BentoCard({ entry }: { entry: Entry }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const colors = useMemo(() => gradientFromId(entry.id), [entry.id]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const { title, description, meta, status, date, subsection, ready } = entry;

  return (
    <a
      ref={cardRef}
      href={`/${entry.pillar}/${entry.id}`}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl h-[280px]",
        ready ? "border-border" : "border-red-500/50 ring-1 ring-red-500/30",
      )}
      style={
        {
          "--mouse-x": `${mousePos.x}%`,
          "--mouse-y": `${mousePos.y}%`,
          "--c1": colors.c1,
          "--c2": colors.c2,
          "--c3": colors.c3,
        } as React.CSSProperties
      }
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {subsection}
            </span>
            {!ready && (
              <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-500">
                DRAFT
              </span>
            )}
          </div>
          {status ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                statusStyles[status] ?? "bg-secondary text-muted-foreground",
              )}
            >
              {status}
            </span>
          ) : (
            <ArrowUpRight
              className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          )}
        </div>

        <h3 className="mt-3 text-pretty font-sans text-xl leading-snug text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {description}
        </p>

        <div className="flex-1" />

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          {meta ? <span>{meta}</span> : <span />}
          {date ? (
            <span className="tabular-nums">{formatDate(date)}</span>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500 backdrop-blur-sm",
          isHovered ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--c1) / 0.25) 0%, hsl(var(--c2) / 0.2) 40%, hsl(var(--c3) / 0.15) 70%, transparent 100%)`,
        }}
      />
    </a>
  );
}
