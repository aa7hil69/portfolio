// import React, { useEffect, useState, useRef } from "react";
// import { motion, useAnimation, useInView, useAnimationFrame, useMotionValue } from "framer-motion";

// /* ---------------- Animations ---------------- */

// const slideInFromRight = {
//   hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
//   show: {
//     opacity: 1,
//     x: 0,
//     filter: "blur(0px)",
//     transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
//   },
// };

// const textStagger = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1, transition: { staggerChildren: 0.08 } },
// };

// /* ---------------- Gallery ---------------- */

// export const Gallery = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const headerRef = useRef(null);
//   const headerInView = useInView(headerRef, { amount: 0.6 });
//   const headerControls = useAnimation();

//   useEffect(() => {
//     headerControls.start(headerInView ? "show" : "hidden");
//   }, [headerInView, headerControls]);

//   useEffect(() => {
//     let ignore = false;

//     async function fetchGallery() {
//       try {
//         const res = await fetch("/api/galleries");
//         if (!res.ok) throw new Error("Failed to fetch gallery");

//         const data = await res.json();

//         const mapped = Array.isArray(data.gallery)
//           ? data.gallery.map((g) => ({
//               id: g.id,
//               src: g.image_path,
//               title: g.title,
//               description: g.description,
//             }))
//           : [];

//         if (!ignore) setItems(mapped);
//       } catch (err) {
//         console.error("Gallery fetch error:", err);
//         if (!ignore) setItems([]);
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     }

//     fetchGallery();
//     return () => {
//       ignore = true;
//     };
//   }, []);

//   return (
//     <section className="bg-[#061d42] py-4" id="gallery">
//       <div className="mx-auto max-w-7xl px-4">
//         <motion.div
//           ref={headerRef}
//           variants={textStagger}
//           initial="hidden"
//           animate={headerControls}
//           className="text-center"
//         >
//           <motion.h2
//             variants={slideInFromRight}
//             className="text-white text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide"
//           >
//             Gallery
//           </motion.h2>
//         </motion.div>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 mt-8">
//         {loading ? (
//           <p className="text-center text-white/70">Loading...</p>
//         ) : items.length ? (
//           <AnimatedGrid items={items} />
//         ) : (
//           <p className="text-center text-white/70">No images found.</p>
//         )}
//       </div>
//     </section>
//   );
// };

// /* ---------------- Grid ---------------- */

// const SPEED = 40; // px per second (adjust to taste)

// const AnimatedGrid = ({ items }) => {
//   const trackRef = useRef(null);
//   const x = useMotionValue(0);

//   const [width, setWidth] = useState(0);
//   const [paused, setPaused] = useState(false);

//   const loopItems = [...items, ...items];

//   /* Measure width once items are rendered */
//   useEffect(() => {
//     if (!trackRef.current) return;
//     setWidth(trackRef.current.scrollWidth / 2);
//   }, [items]);

//   /* Smooth continuous scrolling */
//   useAnimationFrame((_, delta) => {
//     if (paused || !width) return;

//     const move = (SPEED * delta) / 1000;
//     const next = x.get() - move;

//     // Seamless loop
//     x.set(next <= -width ? 0 : next);
//   });

//   return (
//     <div
//       className="overflow-hidden"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       <motion.div
//         ref={trackRef}
//         className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
//         style={{ x }}
//         drag="x"
//         dragMomentum={false}
//         dragElastic={0.06}
//         dragConstraints={{ left: -width, right: 0 }}
//         onDragStart={() => setPaused(true)}
//         onDragEnd={() => setPaused(false)}
//       >
//         {loopItems.map((img, i) => (
//           <article
//             key={`${img.id}-${i}`}
//             className="
//               w-72 flex-shrink-0
//               rounded-xl overflow-hidden
//               bg-[#112a63]
//               ring-1 ring-white/10
//             "
//           >
//             <div className="h-48 overflow-hidden">
//               <img
//                 src={img.src}
//                 alt={img.title}
//                 className="h-full w-full object-cover"
//                 draggable={false}
//                 loading="lazy"
//               />
//             </div>

//             <div className="px-4 py-3">
//               <h3 className="text-white text-sm font-semibold">
//                 {img.title}
//               </h3>
//               <p className="text-white/70 text-xs line-clamp-3">
//                 {img.description}
//               </p>
//             </div>
//           </article>
//         ))}
//       </motion.div>
//     </div>
//   );
// };

  

//   // const container = {
//   //   hidden: { opacity: 0 },
//   //   show: { opacity: 1, transition: { staggerChildren: 0.08 } },
//   // };

//   // const item = {
//   //   hidden: { opacity: 0, x: 40 },
//   //   show: {
//   //     opacity: 1,
//   //     x: 0,
//   //     transition: { type: "spring", stiffness: 260, damping: 26 },
//   //   },
//   // };

//   // return (
//   //   <motion.div
//   //     variants={container}
//   //     initial="hidden"
//   //     whileInView="show"
//   //     viewport={{ once: true, amount: 0.25 }}
//   //     className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory flex-row-reverse no-scrollbar"
//   //   >
//   //     {items.map((img) => (
//   //       <motion.article
//   //         key={img.id}
//   //         variants={item}
//   //         className="flex-shrink-0
//   //                   h-90
//   //                   w-70
//   //                   flex flex-col
//   //                   overflow-hidden
//   //                   rounded-xl
//   //                   bg-[#0b0f14]
//   //                   ring-1 ring-white/10
//   //                   snap-start"
//   //       >
//   //         {/* Image */}
//   //         <div className="h-48 w-full overflow-hidden">
//   //           <img
//   //             src={img.src}
//   //             alt={img.title}
//   //             className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
//   //             loading="lazy"
//   //           />
//   //         </div>

//   //         {/* Content */}
//   //         <div className="flex flex-col flex-1 px-4 py-3">
//   //           <h3 className="text-white text-base font-semibold leading-tight">
//   //             {img.title}
//   //           </h3>
//   //           <p className="mt-1 text-white/70 text-xs leading-relaxed line-clamp-3">
//   //             {img.description}
//   //           </p>
//   //         </div>
//   //       </motion.article>
//   //     ))}
//   //   </motion.div>
//   // );


import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { GallerySkeleton } from "../ui/Skeleton";
import { withMinSkeletonTime } from "../../utils/withMinSkeletonTime";

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
  const [active, setActive] = useState(null); // lightbox item

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6 });
  const headerControls = useAnimation();

  useEffect(() => {
    headerControls.start(headerInView ? "show" : "hidden");
  }, [headerInView, headerControls]);

  useEffect(() => {
    let ignore = false;

    async function fetchGallery() {
      const startedAt = Date.now();
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
        console.error(err);
        if (!ignore) setItems([]);
      } finally {
        await withMinSkeletonTime(startedAt, 3000);
        if (!ignore) setLoading(false);
      }
    }

    fetchGallery();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <section className="bg-[#061d42] py-6" id="gallery">
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
            <GallerySkeleton count={4} />
          ) : items.length ? (
            <AnimatedGrid items={items} onOpen={setActive} />
          ) : (
            <p className="text-center text-white/70">No images found.</p>
          )}
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md
                       flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full bg-[#0b1d3a]
                         rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 text-white/80
                           hover:text-white text-2xl"
              >
                ✕
              </button>

              {/* Image */}
              <div className="max-h-[70vh] overflow-hidden bg-black">
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h3 className="font-teko text-2xl sm:text-3xl text-white mb-4">
                  {active.title}
                </h3>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  {active.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ---------------- Animated Grid ---------------- */

const SPEED = 40;

const AnimatedGrid = ({ items, onOpen }) => {
  const trackRef = useRef(null);
  const x = useMotionValue(0);

  const [width, setWidth] = useState(0);
  const [paused, setPaused] = useState(false);

  const loopItems = [...items, ...items];

  useEffect(() => {
    if (!trackRef.current) return;
    setWidth(trackRef.current.scrollWidth / 2);
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (paused || !width) return;
    const move = (SPEED * delta) / 1000;
    const next = x.get() - move;
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
        className="flex gap-6 w-max"
        style={{ x }}
      >
        {loopItems.map((img, i) => (
          <article
            key={`${img.id}-${i}`}
            className="w-72 flex-shrink-0 rounded-xl
                       bg-[#112a63] ring-1 ring-white/10
                       overflow-hidden"
          >
            {/* Image */}
            <div
              className="h-48 cursor-pointer overflow-hidden"
              onClick={() => onOpen(img)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="h-full w-full object-cover
                           transition-transform duration-500
                           hover:scale-105"
                draggable={false}
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <h3 className="text-white text-sm font-semibold">
                {img.title}
              </h3>
              <p className="text-white/70 text-xs line-clamp-2">
                {img.description}
              </p>

              <button
                onClick={() => onOpen(img)}
                className="mt-2 text-xs font-semibold
                           text-blue-400 hover:underline"
              >
                Read more →
              </button>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
};
