"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const VALID_PAGES = ["home", "products", "investments", "principles", "assumptions"] as const;
type PageId = (typeof VALID_PAGES)[number];

function getActivePage(pathname: string): PageId {
  if (pathname === "/") return "home";
  const segment = pathname.split("/")[1];
  if (VALID_PAGES.includes(segment as PageId)) return segment as PageId;
  return "home";
}

export function useNavIndicator() {
  const pathname = usePathname();
  const activePage = getActivePage(pathname);
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

  return { navRef, indicator, activePage };
}
