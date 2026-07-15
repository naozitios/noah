"use client";

import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function ArticleShell({
  breadcrumb,
  children,
}: {
  breadcrumb: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        {breadcrumb}
        {children}
      </main>
    </div>
  );
}
