import { useEffect, useRef } from "react";

export function usePlayOnView({ threshold = 0.15, root = null, rootMargin = "0px 0px -5% 0px", once = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion: just add play immediately
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("play");
      return;
    }

    // Wait until splash is done to avoid early class toggles
    if (!document.body.classList.contains("app-ready")) {
      const id = requestAnimationFrame(() => {
        if (document.body.classList.contains("app-ready")) {
          el.classList.add("play");
        }
      });
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add("play");
          if (once) io.unobserve(entry.target);
        }
      });
    }, { threshold, root, rootMargin });

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, root, rootMargin, once]);

  return { ref };
}
