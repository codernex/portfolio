"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useOSStore } from "@/lib/os-store";

export default function OSContextProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { openWindow } = useOSStore();

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/about")) {
      openWindow("about");
    } else if (pathname.startsWith("/projects")) {
      openWindow("projects");
    } else if (pathname.startsWith("/experience")) {
      openWindow("experience");
    } else if (pathname.startsWith("/skills")) {
      openWindow("skills");
    } else if (pathname.startsWith("/blog")) {
      openWindow("blog");
    } else if (pathname.startsWith("/contact")) {
      openWindow("contact");
    }
  }, [pathname, openWindow]);

  return <>{children}</>;
}
