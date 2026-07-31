"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true); // Hide until mouse moves to prevent weird placement

  useEffect(() => {
    // Check if device is a touch screen. If so, don't show custom cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500 transition-all duration-300 ${
          clicked ? "h-6 w-6 bg-emerald-500/20" : "h-8 w-8"
        }`}
      />
      <div className="absolute -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
    </div>
  );
}
