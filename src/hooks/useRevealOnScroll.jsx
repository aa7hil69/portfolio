import { useEffect, useRef, useState } from "react";

export function useRevealOnScroll(options = {}) {
  const {
    root = null,
    rootMargin = "0px 0px -5% 0px",
    threshold = 0.15,
    once = true,
  } = options;

  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.unobserve(entry.target);
        }
      });
    }, { root, rootMargin, threshold });

    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold, once]);

  return { ref, inView };
}
