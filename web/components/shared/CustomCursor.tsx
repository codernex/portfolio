"use client";

import { useEffect, useRef, useState } from "react";
import { useOSStore } from "@/lib/os-store";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  const customCursorEnabled = useOSStore((state) => state.customCursorEnabled ?? false);

  useEffect(() => {
    if (!customCursorEnabled) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let rafId: number;

    const updatePosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (hidden) setHidden(false);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    rafId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [customCursorEnabled, hidden]);

  if (!customCursorEnabled || hidden) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
    >
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500 transition-all duration-150 ${
          clicked ? "h-6 w-6 bg-emerald-500/20" : "h-8 w-8"
        }`}
      />
      <div className="absolute -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
    </div>
  );
}
