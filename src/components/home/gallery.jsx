import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimation,
  useInView,
} from "framer-motion";

/* ---------------- Animations ---------------- */

const slideInFromRight = {
  hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const textStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

/* ---------------- Gallery ---------------- */

export const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6 });
  const headerControls = useAnimation();

  useEffect(() => {
    headerControls.start(headerInView ? "show" : "hidden");
  }, [headerInView, headerControls]);

  useEffect(() => {
    let ignore = false;

    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");

        if (!res.ok) throw new Error("Failed to fetch gallery");

        const data = await res.json();

        const mapped = Array.isArray(data.gallery)
          ? data.gallery.map((g) => ({
              id: g.id,
              src: g.image_path,
              title: g.title,
              description: g.description,
            }))
          : [];

        if (!ignore) setItems(mapped);
      } catch (err) {
        console.error("Gallery fetch error:", err);
        if (!ignore) setItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchGallery();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="bg-[#061d42] py-12" id="gallery">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          ref={headerRef}
          variants={textStagger}
          initial="hidden"
          animate={headerControls}
          className="text-center"
        >
          <motion.h2
            variants={slideInFromRight}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide"
          >
            Gallery
          </motion.h2>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-8">
        {loading ? (
          <p className="text-center text-white/70">Loading...</p>
        ) : items.length ? (
          <AnimatedGrid items={items} />
        ) : (
          <p className="text-center text-white/70">No images found.</p>
        )}
      </div>
    </section>
  );
};

/* ---------------- Grid ---------------- */

const AnimatedGrid = ({ items }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 15%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [6, -4]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 420, damping: 28 },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
      style={{ scale, y }}
    >
      {items.map((img) => (
        <motion.figure
          key={img.id}
          variants={item}
          className="relative overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/5 group"
        >
          <img
            src={img.src}
            alt={img.title}
            className="h-36 sm:h-40 md:h-44 lg:h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div>
              <h3 className="text-white text-sm font-semibold">
                {img.title}
              </h3>
              <p className="text-white/80 text-xs line-clamp-2">
                {img.description}
              </p>
            </div>
          </div>
        </motion.figure>
      ))}
    </motion.div>
  );
};

