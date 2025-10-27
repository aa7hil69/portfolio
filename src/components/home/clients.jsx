import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

// Variants
const slideInFromLeft = {
  hidden: { opacity: 0, x: -50, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    x: 50,
    filter: "blur(6px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Function to chunk array (keep unchanged)
const chunkArray = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return [];
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

// Panel component (same as your version)
function Panel({ items = [], rows = 12, seed = 0, loading, error }) {
  const computed = useMemo(() => {
    if (!items?.length) return [];
    if (items.length <= rows) return items;
    return Array.from({ length: rows }, (_, i) => items[(i * 3 + seed) % items.length]);
  }, [items, rows, seed]);

  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.5, margin: "0px 0px -10% 0px" });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (inView && !hasEntered) setHasEntered(true);
  }, [inView, hasEntered]);

  const listControls = useAnimation();
  useEffect(() => {
    listControls.start(inView ? "show" : "hidden");
  }, [inView, listControls]);

  return (
    <section ref={wrapRef} className="group relative overflow-hidden rounded-2xl text-white shadow-sm ">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={hasEntered ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.8 }}
        className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="p-4 sm:p-5">
          {loading && <div className="text-slate-300 text-sm">Loading...</div>}
          {error && <div className="text-red-300 text-sm">Failed to load data</div>}
          {!loading && !error && (
            <motion.ul variants={listContainer} initial="hidden" animate={listControls} className="space-y-3">
              {computed.map((t, i) => (
                <motion.li
                  key={i}
                  variants={listItem}
                  className="rounded-lg bg-[#112a63] px-3 py-2 text-[13px] leading-5 shadow-sm transition-colors hover:bg-[#1a3570] text-white"
                  title={t}
                >
                  {t}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </motion.div>
    </section>
  );
}

const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const listItem = {
  hidden: { opacity: 0, x: -10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 420, damping: 28 },
  },
};

export const Clients = () => {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  let ignore = false;
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://raw.githubusercontent.com/aa7hil69/portfolio/main/db.json", {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!ignore) setNames(data.companies.map((x) => x.name));
    } catch (e) {
      if (!ignore) setError(e);
    } finally {
      if (!ignore) setLoading(false);
    }
  }
  load();
  return () => {
    ignore = true;
  };
}, []);


  const chunks = useMemo(() => chunkArray(names, 12), [names]);

  // Header refs and animation controls
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6 });
  const headerControls = useAnimation();

  useEffect(() => {
    headerControls.start(headerInView ? "show" : "exit");
  }, [headerInView, headerControls]);

  // Paragraph refs and animation controls for scrolling animate
  const paraRef = useRef(null);
  const paraInView = useInView(paraRef, { amount: 0.5 });
  const paraControls = useAnimation();

  useEffect(() => {
    paraControls.start(paraInView ? "show" : "hidden");
  }, [paraInView, paraControls]);

  return (
    <div id="clients" className="min-h-screen bg-[#061d42] text-white antialiased px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        <div className="container mx-auto max-w-7xl text-center">
          <div ref={headerRef}>
            <motion.h2
              initial="hidden"
              animate={headerControls}
              variants={slideInFromLeft}
              className="text-white text-2xl sm:text-3xl md:text-4xl font-teko tracking-wide"
            >
              Our Clients
            </motion.h2>
          </div>

          <motion.div initial="hidden" animate={headerControls} variants={slideInFromLeft} className="mt-3 flex justify-center">
            <div className="h-1 w-16 sm:w-24 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500" />
          </motion.div>

          <motion.p
            ref={paraRef}
            initial="hidden"
            animate={paraControls}
            variants={slideUp}
            className="mt-4 text-xs sm:text-sm md:text-base text-slate-200 max-w-full sm:max-w-2xl mx-auto"
          >
            Over the years, we have partnered with leading organizations, corporations, and institutions across the region.
            Here are some of the esteemed clients and associates who have trusted our services.
          </motion.p>
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 sm:gap-8">
              {chunks.map((chunk, idx) => (
                <Panel key={idx} seed={idx + 1} rows={12} items={chunk} loading={loading} error={error} />
              ))}
            </div>
          </div>
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};
