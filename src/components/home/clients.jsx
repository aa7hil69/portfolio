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
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

/* ---------------- Panel ---------------- */

function Panel({ items = [], loading, error }) {
  return (
    <section className="rounded-2xl bg-[#112a63] p-4 text-white">
      {loading && <p className="text-sm text-slate-300">Loading...</p>}
      {error && <p className="text-sm text-red-300">Failed to load clients</p>}

      {!loading && !error && (
        <ul className="space-y-2 text-sm">
          {items.map((name, i) => (
            <li
              key={i}
              className="rounded bg-[#1a3570] px-3 py-2"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------------- Clients ---------------- */

export const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Same fetch structure as Events.jsx
  useEffect(() => {
    let ignore = false;

    async function fetchClients() {
      try {
        const res = await fetch("/api/clients");
        if (!res.ok) throw new Error("Failed to fetch clients");

        const data = await res.json();

        const mapped = Array.isArray(data.clients)
          ? data.clients.map((c) => c.clientname)
          : [];

        if (!ignore) setClients(mapped);
      } catch (err) {
        console.error("Clients error:", err);
        if (!ignore) setError("Unable to load clients");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchClients();
    return () => {
      ignore = true;
    };
  }, []);

  const chunks = useMemo(() => chunkArray(clients, 12), [clients]);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6 });
  const headerControls = useAnimation();

  useEffect(() => {
    headerControls.start(headerInView ? "show" : "hidden");
  }, [headerInView, headerControls]);

  return (
    <div id="clients" className="min-h-screen bg-[#061d42] text-white px-4">
      <div className="py-16 max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center">
          <motion.h2
            initial="hidden"
            animate={headerControls}
            variants={slideInFromLeft}
            className="text-2xl sm:text-3xl md:text-4xl font-teko"
          >
            Our Clients
          </motion.h2>

          <motion.p
            variants={slideUp}
            initial="hidden"
            animate={headerControls}
            className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto"
          >
            Organizations and institutions that trust our services.
          </motion.p>
        </div>

        {loading && (
          <p className="text-center text-white/70 mt-10">
            Loading clients...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 mt-10">
            {error}
          </p>
        )}

        {!loading && !error && clients.length === 0 && (
          <p className="text-center text-white/70 mt-10">
            No clients found.
          </p>
        )}

        {!loading && !error && clients.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {chunks.map((chunk, idx) => (
              <Panel
                key={idx}
                items={chunk}
                loading={loading}
                error={error}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
