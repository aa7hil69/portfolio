import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useAnimation,
} from "framer-motion";

export const Companies = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  const controls = useAnimation();

  useEffect(() => {
    const playInitial = async () => {
      await controls.start("hidden");
      await controls.start("show");
    };
    playInitial();
  }, [controls]);

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [inView, controls]);

  const gridRef = useRef(null);
  const [leaving, setLeaving] = useState(false);

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 80%", "end 20%"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 0.94]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.15 },
    }
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 600, damping: 35, mass: 0.7 },
    }
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const handleLeave = () => setLeaving(true);
  const handleEnter = () => setLeaving(false);

  // Paragraph animation setup
  const paraRef = useRef(null);
  const paraInView = useInView(paraRef, { amount: 0.5 });
  const paraControls = useAnimation();

  useEffect(() => {
    paraControls.start(paraInView ? "show" : "hidden");
  }, [paraInView, paraControls]);

  return (
    <section
      id="companies"
      className="flex min-h-screen items-center justify-center bg-[#061d42] px-4 sm:px-6 py-12"
    >
      <div className="w-full max-w-7xl">
        <motion.div
          ref={ref}
          className="relative text-center mb-8 sm:mb-10 px-2 sm:px-0"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.6, once: false }}
        >
          <motion.h2
            variants={slideInLeft}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide"
          >
            Discover our companies
          </motion.h2>

          <motion.div variants={slideUp} className="mt-3 flex justify-center">
            <div className="h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500" />
          </motion.div>

          <motion.p
            ref={paraRef}
            initial="hidden"
            variants={slideUp}
            whileInView="show"
            viewport={{ amount: 0.5, once: false }}
            className="text-white/80 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-3xl mx-auto mt-4"
          >
            Explore our curated partner brands. Each tile highlights the logo,
            brief summary, and a quick link to learn more. Hover or focus on a card,
            then open the website.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="companies-grid"
            ref={gridRef}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.3, once: false }}
            className="relative grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              initial={{ opacity: 0 }}
              animate={leaving ? { opacity: 0.3 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background:
                  "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
              }}
            />

            {[
              {
                href: "https://example.com/jessy",
                alt: "Jessy Mathew International SPC",
                src: "/logopics/logo1.png",
                title: "Jessy Mathew International SPC",
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolore adipisci placeat.",
              },
              {
                href: "https://example.com/camden",
                alt: "Camden Importers and Exporters Private Limited",
                src: "/logopics/logo3.png",
                title: "Camden Importers and Exporters Private Limited",
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolore adipisci placeat.",
              },
              {
                href: "https://example.com/jj2",
                alt: "JJ² Consultancy UK Limited",
                src: "/logopics/logo2.png",
                title: "JJ² Consultancy UK Limited",
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolore adipisci placeat.",
              },
            ].map(({ href, alt, src, title, description }, i) => (
              <motion.a
                key={i}
                variants={slideInRight}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title} website`}
                className="group relative block bg-[#173e88] cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl transition-transform duration-300 hover:shadow-2xl hover:shadow-black/40 hover:z-10 will-change-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus:scale-105"
              >
                <div className="relative h-56 sm:h-72 md:h-100 w-full mx-auto flex items-center justify-center">
                  <motion.img
                    style={{ scale: imgScale }}
                    src={src}
                    alt={alt}
                    className="h-40 sm:h-52 md:h-56 w-auto object-contain transition-transform duration-500 group-hover:rotate-1"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b1d3a]/35 via-[#0b1d3a]/50 to-[#0b1d3a]/80" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0b1d3a]/80 via-[#0b1d3a]/65 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-8 text-center">
                  <h3 className="font-teko text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {title}
                  </h3>
                  <p className="mb-4 mt-3 text-sm sm:text-base italic text-white max-w-[240px]">
                    {description}
                  </p>
                  <span className="rounded-full bg-[#0c1f40] py-2 px-4 sm:py-3 sm:px-5 font-teko text-xs sm:text-sm uppercase tracking-wide text-white shadow shadow-black/60 transition-colors group-hover:bg-[#0f264f]">
                    See More
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
