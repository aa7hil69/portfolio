// src/components/home/gallery.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion";

// Use an env var in real apps; fallback for local testing only.
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// Helper: extract usable URLs from Pexels photos[]
const toUrls = (photos) =>
  Array.isArray(photos)
    ? photos
        .map((p) => p?.src?.large || p?.src?.medium || p?.src?.landscape)
        .filter(Boolean)
    : [];

// Helper: quick shuffle
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const slideInFromRight = {
  hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    x: -50,
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


export const Gallery = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Pick a random page to simulate randomness (Pexels caches curated for 24h)
  const perPage = 25; // 5x5 grid
  const maxPage = 100; // arbitrary upper bound for randomness
  const [pageSeed, setPageSeed] = useState(() => 1 + Math.floor(Math.random() * maxPage));

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const base = query.trim()
          ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${pageSeed}`
          : `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${pageSeed}`;

        const res = await fetch(base, {
          headers: { Authorization: API_KEY, Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const urls = shuffle(toUrls(json.photos)).slice(0, perPage);
        if (!ignore) setImages(urls);
      } catch (e) {
        console.warn("Pexels fetch failed:", e);
        if (!ignore) setImages([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [API_KEY, query, pageSeed]);

  const refreshRandom = () => {
    setPageSeed(1 + Math.floor(Math.random() * maxPage));
  };

  // Header text in/out controller: play once on mount, then follow inView
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6 });
  const headerControls = useAnimation();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await headerControls.start("hidden"); // ensure hidden at mount
      if (!mounted) return;
      await headerControls.start("show");   // initial entrance on load
    };
    run();
    return () => {
      mounted = false;
    };
  }, [headerControls]); // initial load entrance [12]

  useEffect(() => {
    headerControls.start(headerInView ? "show" : "hidden");
  }, [headerInView, headerControls]); // scroll in/out [13][11]

  // Variants for slide-up text and stagger
  const textStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
  }; // [5]

  const slideUp = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }; // [3][11]

  return (
    <section className="bg-[#061d42] py-12" id="gallery">
      {/* Section orchestrator */}
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          ref={headerRef}
          variants={textStagger}
          initial="hidden"
          animate={headerControls}
          className="text-center"
        >
          <motion.h2 variants={slideInFromRight} className="text-white text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide">
            Gallery
          </motion.h2>
          <motion.div variants={slideUp} className="mt-3 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500" />
          <motion.p variants={slideUp} className="mt-3 text-white/80">
            Photos provided by Pexels.
          </motion.p>

          {/* Controls */}
          <motion.div
            variants={slideUp}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <input
              className="w-60 rounded-md bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none"
              placeholder="Search (optional)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuery(e.currentTarget.value);
                  refreshRandom();
                }
              }}
            />
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white"
              onClick={refreshRandom}
              disabled={loading}
              title="Show another random set"
            >
              Randomize
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Grid container with stagger */}
      <div className="mx-auto max-w-7xl px-4 mt-8">
        {loading ? (
          <p className="text-center text-white/70">Loading...</p>
        ) : images.length ? (
          <AnimatedGrid images={images} />
        ) : (
          <p className="text-center text-white/70">No images found.</p>
        )}
      </div>
    </section>
  );
};

// Animated grid component
const AnimatedGrid = ({ images = [] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 15%"],
  }); // drive gentle parallax while grid passes through viewport. [9]

  // Global scroll mapping for a subtle depth effect
  const globalScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.0]);
  const globalY = useTransform(scrollYProgress, [0, 1], [6, -4]);

  const container = {
    hidden: { opacity: 0, y: 12, filter: "blur(2px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      y: 40,
      filter: "blur(6px)",
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
  }; // clear in + noticeable out [3]

  const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 420, damping: 28 },
    },
  }; // staggered cards [1]

  return (
    <motion.div
      ref={containerRef}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
      style={{ y: globalY, scale: globalScale }}
    >
      {images.map((src, i) => (
        <motion.figure
          key={src + i}
          variants={item}
          className="relative overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/5"
        >
          <img
            src={src}
            alt={`Gallery ${i + 1}`}
            className="h-36 sm:h-40 md:h-44 lg:h-48 w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.03]"
            loading="lazy"
          />
          <figcaption className="sr-only">Gallery image {i + 1}</figcaption>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </motion.figure>
      ))}
    </motion.div>
  );
};
