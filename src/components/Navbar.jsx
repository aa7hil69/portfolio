import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaInstagram, FaLinkedin, FaFacebook, FaGlobe } from "react-icons/fa";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

const brandReveal = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 },
  },
};

export const Navbar = ({ appReady = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [isOpen]);

  const onKey = useCallback((e) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onKey]);

  const extProps = { target: "_blank", rel: "noopener noreferrer" };
  const toggleNavbar = () => setIsOpen((v) => !v);

  // Scroll-linked values
  const { scrollY, scrollYProgress } = useScroll();

  // Elastic "tug" – springed for smoothness
  const progressSpring = useSpring(scrollYProgress, { stiffness: 180, damping: 26, mass: 0.6 });
  const tug = useTransform(progressSpring, [0, 0.15], [0, 8]);

  // Stable hide/show with hysteresis
  const [hidden, setHidden] = useState(false);
  const last = useRef({ y: 0, ts: performance.now(), intent: "none" });
  const ACCEL_PX = 3;
  const MIN_Y = 48;
  const HIDE_AFTER_MS = 80;
  const SHOW_AFTER_MS = 60;

  useMotionValueEvent(scrollY, "change", (y) => {
    const dy = y - last.current.y;
    const dir = dy > ACCEL_PX ? "down" : dy < -ACCEL_PX ? "up" : "none";
    const now = performance.now();

    last.current.y = y;

    if (dir !== "none" && dir !== last.current.intent) {
      last.current.intent = dir;
      last.current.ts = now;
      return;
    }

    const elapsed = now - last.current.ts;

    if (!hidden && dir === "down" && y > MIN_Y && elapsed > HIDE_AFTER_MS) {
      setHidden(true);
    } else if (hidden && dir === "up" && elapsed > SHOW_AFTER_MS) {
      setHidden(false);
    }
  });

  // Smooth base offset using a spring
  const targetBase = hidden ? -90 : 0;
  const baseY = useSpring(targetBase, { stiffness: 340, damping: 28, mass: 0.8 });

  // Damp tug when hidden
  const dampedTug = useTransform(tug, (v) => (hidden ? 0 : v));
  const y = useTransform([baseY, dampedTug], ([b, t]) => b + t);

  return (
    <>
      <style>
        {`
        @keyframes brandShimmer {
          0% { transform: translateX(-60%); filter: blur(2px) brightness(1.1); opacity: .0; }
          35% { opacity: .55; }
          100% { transform: translateX(0%); filter: blur(0px) brightness(1); opacity: .9; }
        }
        `}
      </style>

      <motion.div
        style={{ y }}
        className={[
          "top-0 left-0 right-0 z-50",
          "transition-colors duration-300 ease-in-out",
          "border-b",
          isScrolled
            ? "bg-[#061d42]/95 border-white/10 shadow-lg shadow-black/10 backdrop-blur-sm"
            : "bg-[#061d42] border-transparent",
          "supports-[backdrop-filter]:backdrop-blur",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 relative">
          <div className="flex h-13 md:h-20 items-center justify-between">
            {/* LEFT logos */}
            <div
              className={[
                "flex items-center gap-3 md:gap-6",
                appReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
                "transition-all duration-500",
              ].join(" ")}
            >
              <a
                href="https://example1.com"
                className="group relative flex items-center"
                {...extProps}
                aria-label="Jessy Mathew International SPC"
              >
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full ring-2 ring-white/15 bg-white/0 grid place-items-center transform transition-transform duration-200 ease-out group-hover:scale-110">
                  <img
                    src="/logopics/logo1.png"
                    alt="Jessy Mathew International SPC"
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain bg-transparent"
                  />
                </div>
              </a>
              <a
                href="https://example3.com"
                className="group relative flex items-center"
                {...extProps}
                aria-label="Camden Importers and Exporters Pvt Ltd"
              >
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full ring-2 ring-white/15 bg-white/0 grid place-items-center transform transition-transform duration-200 ease-out group-hover:scale-110">
                  <img
                    src="/logopics/logo3.png"
                    alt="Camden Importers and Exporters Private Limited"
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain bg-transparent"
                  />
                </div>
              </a>
              <a
                href="https://example2.com"
                className="group relative flex items-center"
                {...extProps}
                aria-label="JJ2 Consultancy UK Limited"
              >
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full ring-2 ring-white/15 bg-white/0 grid place-items-center transform transition-transform duration-200 ease-out group-hover:scale-110">
                  <img
                    src="/logopics/logo2.png"
                    alt="JJ2 Consultancy UK Limited"
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain bg-transparent"
                  />
                </div>
              </a>
            </div>

            {/* CENTER brand (hidden on mobile) */}
            <div
              className={[
                "absolute left-1/2 top-0 h-13 sm:h-16 md:h-20 -translate-x-1/2 flex items-center",
                appReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
                "transition-all duration-500",
                "max-w-[90vw]",
                "px-2",
                "sm:max-w-none sm:px-0",
                "hidden sm:flex", // Hide on xs, show from sm breakpoint
              ].join(" ")}
              aria-hidden="false"
            >
              <motion.div
                style={{ y: tug }}
                className="flex flex-col items-center truncate"
                initial="hidden"
                animate="show"
                variants={brandReveal}
              >
                <span
                  className="text-white leading-none select-none whitespace-nowrap mt-10 mb-7"
                  style={{
                    fontFamily: "var(--font-bergstena)",
                    fontWeight: 100,
                    fontSize: "20px",
                  }}
                >
                  <span className="hidden sm:inline" style={{fontSize: "40px" }}>
                    Jessy Mathew
                  </span>
                  <span className="sm:hidden">Jessy Mathew</span>
                </span>
               
              </motion.div>
            </div>

            {/* RIGHT socials */}
            <div
              className={[
                "hidden md:flex items-center gap-4 sm:gap-6",
                appReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
                "transition-all duration-500",
              ].join(" ")}
            >
              <a
                href="https://www.instagram.com/jm_international_spc/"
                className="group inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60"
                {...extProps}
                aria-label="Instagram"
              >
                <FaInstagram
                  size={22}
                  className="text-white/90 transition-[transform,color] duration-200 ease-out group-hover:scale-[1.12] group-hover:text-pink-400"
                />
              </a>
              <a
                href="hhttps://www.linkedin.com/in/jessy-mathew-55318b99/"
                className="group inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                {...extProps}
                aria-label="LinkedIn"
              >
                <FaLinkedin
                  size={22}
                  className="text-white/90 transition-[transform,color] duration-200 ease-out group-hover:scale-[1.12] group-hover:text-sky-400"
                />
              </a>
              <a
                href="https://facebook.com/yourpage"
                className="group inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                {...extProps}
                aria-label="Facebook"
              >
                <FaFacebook
                  size={22}
                  className="text-white/90 transition-[transform,color] duration-200 ease-out group-hover:scale-[1.12] group-hover:text-blue-500"
                />
              </a>
              <a
                href="https://jminternationalspc.com/"
                className="group inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                {...extProps}
                aria-label="Website"
              >
                <FaGlobe
                  size={22}
                  className="text-white/90 transition-[transform,color] duration-200 ease-out group-hover:scale-[1.12] group-hover:text-emerald-400"
                />
              </a>
            </div>

            {/* MOBILE trigger */}
            <button
              onClick={toggleNavbar}
              className="md:hidden inline-flex items-center justify-center text-white/95 rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <FaBars size={22} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile drawer */}
      <div
        className={["fixed inset-0 z-50 md:hidden", isOpen ? "pointer-events-auto" : "pointer-events-none"].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={["absolute inset-0 bg-black/60 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0"].join(
            " "
          )}
          onClick={toggleNavbar}
          aria-hidden
        />
        <div
          className={[
            "absolute right-0 top-0 h-full w-[86%] max-w-sm",
            "transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="h-full bg-[#0a2557]/85 backdrop-blur-md border-l border-white/10 text-white shadow-xl">
            <div className="flex h-[56px] items-center justify-between px-4">
              <span className="text-sm tracking-wide text-white/90">Menu</span>
              <button
                onClick={toggleNavbar}
                className="rounded-md p-2 text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Close menu"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="px-4 pb-8 pt-4 space-y-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <img src="/logopics/logo1.png" alt="Logo 1" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full ring-1 ring-white/10" />
                <img src="/logopics/logo3.png" alt="Logo 2" className="h-9 w-9 sm:h-11 sm:w-11 rounded-full ring-1 ring-white/10" />
                <img src="/logopics/logo2.png" alt="Logo 3" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-1 ring-white/10" />
              </div>

              <nav className="space-y-3 text-white/90 text-base sm:text-lg">
                <a onClick={toggleNavbar} href="#home" className="block py-2 hover:text-white">
                  Home
                </a>
                <a onClick={toggleNavbar} href="#companies" className="block py-2 hover:text-white">
                  Companies
                </a>
                <a onClick={toggleNavbar} href="#clients" className="block py-2 hover:text-white">
                  Clients
                </a>
                <a onClick={toggleNavbar} href="#gallery" className="block py-2 hover:text-white">
                  Gallery
                </a>
                <a onClick={toggleNavbar} href="#events" className="block py-2 hover:text-white">
                  Events
                </a>
                <a onClick={toggleNavbar} href="#contact" className="block py-2 hover:text-white">
                  Contact
                </a>
              </nav>

              <div className="flex items-center gap-6 pt-2">
                <a
                  href="https://www.instagram.com/jm_international_spc/"
                  {...extProps}
                  aria-label="Instagram"
                  className="rounded-md p-2 hover:bg-white/5"
                >
                  <FaInstagram size={26} className="text-white hover:text-pink-400 transition-colors duration-200" />
                </a>
                <a
                  href="https://www.linkedin.com/in/jessy-mathew-55318b99/"
                  {...extProps}
                  aria-label="LinkedIn"
                  className="rounded-md p-2 hover:bg-white/5"
                >
                  <FaLinkedin size={26} className="text-white hover:text-sky-400 transition-colors duration-200" />
                </a>
                <a
                  href="https://facebook.com/yourpage"
                  {...extProps}
                  aria-label="Facebook"
                  className="rounded-md p-2 hover:bg-white/5"
                >
                  <FaFacebook size={26} className="text-white hover:text-blue-500 transition-colors duration-200" />
                </a>
                <a
                  href="https://jminternationalspc.com/"
                  {...extProps}
                  aria-label="Website"
                  className="rounded-md p-2 hover:bg-white/5"
                >
                  <FaGlobe size={26} className="text-white hover:text-emerald-400 transition-colors duration-200" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to offset fixed bar */}
      <div className="h-16 md:h-20" />
    </>
  );
};
