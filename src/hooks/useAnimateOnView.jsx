import { useEffect } from "react";

const isInViewport = (el) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
};

export function useAnimateOnView(refs = [], playClass = "card-wipe-play-ltr") {
  useEffect(() => {
    const onScroll = () => {
      refs.forEach(({ current }) => {
        if (current && isInViewport(current) && !current.classList.contains(playClass)) {
          current.classList.add(playClass);
        }
      });
    };

    onScroll(); // Run once on mount in case already visible
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [refs, playClass]);
}
