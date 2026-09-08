// ScrollToTopButton.jsx
import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

export function ScrollToTopButton({
  showAfter = 200, // px scrolled before showing; 0 = always show
  size = 65,       // diameter in px
  fadeMs = 250,    // fade duration in ms
  className = "",
} = {}) {
  const [visible, setVisible] = useState(showAfter === 0);

  // Lightweight throttle
  const throttle = (fn, wait) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  };

  useEffect(() => {
    if (showAfter === 0) return;

    const onScroll = throttle(() => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > showAfter);
    }, 80);

    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  // Build size classes safely
  const sizeClasses = `h-[${size}px] w-[${size}px]`;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={[
        // placement
        "fixed right-6 bottom-6 z-50",
        "bottom-[calc(env(safe-area-inset-bottom,0px)+var(--footer-safe,24px))]",
        // shape
        "flex items-center justify-center rounded-full",
        sizeClasses,
        // visuals
        "bg-blue-600  text-white shadow-lg",
        // animation
        `transition-all duration-[${fadeMs}ms] ease-out`,
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none",
        // interactivity
        "hover:scale-105 active:scale-95",
        // focus
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[#D4AF37]",
        className,
      ].join(" ")}
    >
      <IoIosArrowUp
        className="text-white"
        size={Math.round(size * 0.5)}
        aria-hidden="true"
      />
    </button>
  );
}
