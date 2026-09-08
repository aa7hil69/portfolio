import React from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

export function Reveal({
  children,
  direction = "up", // "up" | "left" | "right"
  className = "",
  threshold,
  rootMargin,
  once = true,
}) {
  const { ref, inView } = useRevealOnScroll({ threshold, rootMargin, once });

  // Hidden transforms per direction
  const hidden =
    direction === "left"
      ? "opacity-0 -translate-x-6"
      : direction === "right"
      ? "opacity-0 translate-x-6"
      : "opacity-0 translate-y-8";

  const shown = "opacity-100 translate-x-0 translate-y-0";

  // Avoid hidden state before splash completes to prevent shifting under overlay
  const isAppReady =
    typeof document !== "undefined" &&
    document.body.classList.contains("app-ready");

  const base = "transition-all duration-700 ease-out will-change-transform";

  return (
    <section
      ref={ref}
      className={[
        base,
        isAppReady ? (inView ? shown : hidden) : "",
        className,
      ].join(" ").trim()}
    >
      {children}
    </section>
  );
}
