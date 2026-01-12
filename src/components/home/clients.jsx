import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

/* ---------------- Animations ---------------- */

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

/* ---------------- Helpers ---------------- */

const chunkArray = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return [];
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/* ---------------- Panel ---------------- */

function Panel({ items = [], rows = 12, seed = 0, loading, error }) {
  const computed = useMemo(() => {
    if (!items.length) return [];
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
    <section ref={wrapRef} className="rounded-2xl text-white">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={hasEntered ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        <div className="p-4 sm:p-5">
          {loading && <div className="text-slate-300 text-sm">Loading...</div>}
          {error && <div className="text-red-300 text-sm">Failed to load data</div>}

          {!loading && !error && (
            <motion.ul
              variants={listContainer}
              initial="hidden"
              animate={listControls}
              className="space-y-3"
            >
              {computed.map((name, i) => (
                <motion.li
                  key={i}
                  variants={listItem}
                  className="rounded-lg bg-[#112a63] px-3 py-2 text-[13px] leading-5"
                >
                  {name}
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
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const listItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

/* ---------------- Clients ---------------- */

export const Clients = () => {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  let ignore = false;

  async function fetchClients() {
    try {
      const res = await fetch("/api/client");
      if (!res.ok) throw new Error("Failed to fetch clients");

      const data = await res.json();

      const mapped = Array.isArray(data.clients)
        ? data.clients
            .filter(c => c.status === "1")
            .map(c => c.clientname)
        : [];

      if (!ignore) setNames(mapped);
    } catch (e) {
      console.error(e);
      if (!ignore) setError("Unable to load clients");
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  fetchClients();
  return () => (ignore = true);
}, []);


  const chunks = useMemo(() => chunkArray(names, 12), [names]);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6 });
  const headerControls = useAnimation();

  useEffect(() => {
    headerControls.start(headerInView ? "show" : "exit");
  }, [headerInView, headerControls]);

  const paraRef = useRef(null);
  const paraInView = useInView(paraRef, { amount: 0.5 });
  const paraControls = useAnimation();

  useEffect(() => {
    paraControls.start(paraInView ? "show" : "hidden");
  }, [paraInView, paraControls]);

  return (
    <div id="clients" className="min-h-screen bg-[#061d42] text-white px-4">
      <div className="py-16 max-w-7xl mx-auto">
        <div className="text-center">
          <div ref={headerRef}>
            <motion.h2
              initial="hidden"
              animate={headerControls}
              variants={slideInFromLeft}
              className="text-3xl md:text-4xl font-teko"
            >
              Our Clients
            </motion.h2>
          </div>

          <motion.p
            ref={paraRef}
            initial="hidden"
            animate={paraControls}
            variants={slideUp}
            className="mt-4 text-slate-200 max-w-2xl mx-auto"
          >
            Trusted by leading organizations across the region.
          </motion.p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {chunks.map((chunk, i) => (
            <Panel
              key={i}
              seed={i + 1}
              rows={12}
              items={chunk}
              loading={loading}
              error={error}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
