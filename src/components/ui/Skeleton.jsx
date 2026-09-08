import React from "react";
import { motion, MotionConfig } from "framer-motion";

export function Skeleton({ className = "" }) {
  return (
    <MotionConfig reducedMotion="never">
      <div
        className={[
          "relative overflow-hidden rounded-md bg-white/10",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 35%, rgba(125,180,255,0.35) 50%, rgba(255,255,255,0.08) 65%, transparent 100%)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.15,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.15,
          }}
        />
      </div>
    </MotionConfig>
  );
}

/** Card grid matching the Events page layout */
export function EventsListSkeleton({ count = 6 }) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading events"
    >
      {Array.from({ length: count }, (_, i) => (
        <article
          key={i}
          className="bg-[#112a63] rounded-lg overflow-hidden ring-1 ring-white/10"
          aria-hidden="true"
        >
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-28 mt-2" />
          </div>
        </article>
      ))}
      <span className="sr-only">Loading events…</span>
    </div>
  );
}

/** Three client name panels matching the Clients grid */
export function ClientsSkeleton() {
  const panels = 3;
  const rows = 12;

  return (
    <div
      className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      role="status"
      aria-label="Loading clients"
    >
      {Array.from({ length: panels }, (_, p) => (
        <section
          key={p}
          className="rounded-2xl p-4 sm:p-5 text-white"
          aria-hidden="true"
        >
          <ul className="space-y-3">
            {Array.from({ length: rows }, (_, i) => (
              <li key={i}>
                <Skeleton className="h-[2.375rem] w-full rounded-lg bg-[#112a63]/80" />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <span className="sr-only">Loading clients…</span>
    </div>
  );
}

/** Horizontal gallery cards matching the Gallery marquee */
export function GallerySkeleton({ count = 4 }) {
  return (
    <div
      className="flex gap-6 overflow-hidden"
      role="status"
      aria-label="Loading gallery"
    >
      {Array.from({ length: count }, (_, i) => (
        <article
          key={i}
          className="w-72 flex-shrink-0 rounded-xl overflow-hidden bg-[#112a63] ring-1 ring-white/10"
          aria-hidden="true"
        >
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="px-4 py-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-20 mt-2" />
          </div>
        </article>
      ))}
      <span className="sr-only">Loading gallery…</span>
    </div>
  );
}
