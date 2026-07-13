"use client";

import { useState, useRef, useEffect } from "react";
import type { PageId } from "@/lib/garden-data";

export function useNavIndicator(activePage: PageId) {
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeEl = nav.querySelector(
      `[data-page="${activePage}"]`,
    ) as HTMLElement | null;
    if (activeEl) {
      const { offsetLeft, offsetWidth } = activeEl;
      setIndicator({ left: offsetLeft, width: offsetWidth });
    }
  }, [activePage]);

  return { navRef, indicator };
}
