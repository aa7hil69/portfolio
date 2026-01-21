import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView, useAnimationFrame, useMotionValue } from "framer-motion";

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
        const res = await fetch("/api/galleries");
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
    <section className="bg-[#061d42] py-4" id="gallery">
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

const SPEED = 40; // px per second (adjust to taste)

const AnimatedGrid = ({ items }) => {
  const trackRef = useRef(null);
  const x = useMotionValue(0);

  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);

  const loopItems = [...items, ...items];

  /* Measure width once items are rendered */
  useEffect(() => {
    if (!trackRef.current) return;
    setWidth(trackRef.current.scrollWidth / 2);
  }, [items]);

  /* Smooth continuous scrolling */
  useAnimationFrame((_, delta) => {
    if (paused || !width) return;

    const move = (SPEED * delta) / 1000;
    const next = x.get() - move;

    // Seamless loop
    x.set(next <= -width ? 0 : next);
  });

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        ref={trackRef}
        className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        dragElastic={0.06}
        dragConstraints={{ left: -width, right: 0 }}
        onDragStart={() => setPaused(true)}
        onDragEnd={() => setPaused(false)}
      >
        {loopItems.map((img, i) => (
          <article
            key={`${img.id}-${i}`}
            className="
              w-72 flex-shrink-0
              rounded-xl overflow-hidden
              bg-[#112a63]
              ring-1 ring-white/10
            "
          >
            <div className="h-48 overflow-hidden">
              <img
                src={img.src}
                alt={img.title}
                className="h-full w-full object-cover"
                draggable={false}
                loading="lazy"
              />
            </div>

            <div className="px-4 py-3">
              <h3 className="text-white text-sm font-semibold">
                {img.title}
              </h3>
              <p className="text-white/70 text-xs line-clamp-3">
                {img.description}
              </p>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
};

  

  // const container = {
  //   hidden: { opacity: 0 },
  //   show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  // };

  // const item = {
  //   hidden: { opacity: 0, x: 40 },
  //   show: {
  //     opacity: 1,
  //     x: 0,
  //     transition: { type: "spring", stiffness: 260, damping: 26 },
  //   },
  // };

  // return (
  //   <motion.div
  //     variants={container}
  //     initial="hidden"
  //     whileInView="show"
  //     viewport={{ once: true, amount: 0.25 }}
  //     className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory flex-row-reverse no-scrollbar"
  //   >
  //     {items.map((img) => (
  //       <motion.article
  //         key={img.id}
  //         variants={item}
  //         className="flex-shrink-0
  //                   h-90
  //                   w-70
  //                   flex flex-col
  //                   overflow-hidden
  //                   rounded-xl
  //                   bg-[#0b0f14]
  //                   ring-1 ring-white/10
  //                   snap-start"
  //       >
  //         {/* Image */}
  //         <div className="h-48 w-full overflow-hidden">
  //           <img
  //             src={img.src}
  //             alt={img.title}
  //             className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
  //             loading="lazy"
  //           />
  //         </div>

  //         {/* Content */}
  //         <div className="flex flex-col flex-1 px-4 py-3">
  //           <h3 className="text-white text-base font-semibold leading-tight">
  //             {img.title}
  //           </h3>
  //           <p className="mt-1 text-white/70 text-xs leading-relaxed line-clamp-3">
  //             {img.description}
  //           </p>
  //         </div>
  //       </motion.article>
  //     ))}
  //   </motion.div>
  // );

