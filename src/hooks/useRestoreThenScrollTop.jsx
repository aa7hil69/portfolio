// useRestoreThenScrollTop.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Behavior:
 * - Default: do nothing if already at (or near) the top.
 * - If the user has scrolled in this session and the page is not at top,
 *   jump to top on hard reload (first mount) and on every route entry.
 *
 * Notes:
 * - Uses sessionStorage to persist a lightweight "hasScrolled" flag per tab/session.
 * - Does NOT restore exact positions — avoids the "down then up" flash.
 * - Temporarily disables CSS smooth scrolling to make jumps instant.
 */
export default function useRestoreThenScrollTop({
  threshold = 2,            // pixels tolerance for "at top"
  persistInSession = true,  // keep "hasScrolled" flag across routes/reloads in this session
} = {}) {
  const { pathname, key } = useLocation();
  const hasScrolledRef = useRef(false);

  // Initialize the "hasScrolled" flag from sessionStorage (once)
  useEffect(() => {
    if (!persistInSession) return;
    const stored = sessionStorage.getItem("hasScrolled");
    hasScrolledRef.current = stored === "1";
  }, [persistInSession]);

  // Track user scrolling to set the flag
  useEffect(() => {
    const onScroll = () => {
      if (hasScrolledRef.current) return;
      if (window.scrollY > threshold) {
        hasScrolledRef.current = true;
        if (persistInSession) sessionStorage.setItem("hasScrolled", "1");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, persistInSession]);

  const jumpToTopInstant = () => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = prev || "";
  };

  // On first mount (hard reload): only jump if not at top AND user has scrolled previously in this session
  useEffect(() => {
    if (window.scrollY <= threshold) return;
    if (hasScrolledRef.current) jumpToTopInstant();
  }, [threshold]);

  // On every route entry: only jump if not at top AND user has scrolled previously
  useEffect(() => {
    if (window.scrollY <= threshold) return;
    if (hasScrolledRef.current) jumpToTopInstant();
  }, [pathname, key, threshold]);
}
