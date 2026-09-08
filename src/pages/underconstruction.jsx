import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-[#061d42] text-white relative overflow-hidden flex items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        <motion.img
          src="/logopics/logo2.png"
          alt="JJ² Consultancy UK Limited"
          className="mx-auto h-24 w-24 sm:h-28 sm:w-28 object-contain mb-8"
          animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <p className="text-sky-300/90 text-sm tracking-[0.25em] uppercase mb-3 font-teko">
          JJ² Consultancy UK Limited
        </p>

        <h1 className="font-teko text-4xl sm:text-5xl md:text-6xl tracking-wide leading-none">
          Under Construction
        </h1>

        <div className="mt-4 flex justify-center">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400" />
        </div>

        <p className="mt-6 text-white/75 text-base sm:text-lg font-teko tracking-wide leading-relaxed max-w-md mx-auto">
          Something sharp is being built here. Hard hats on, coffee poured —
          this page will be live soon.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sky-200/80 text-sm font-teko tracking-wider">
          {["Planning", "Designing", "Polishing"].map((step, i) => (
            <motion.span
              key={step}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
            >
              {step}
            </motion.span>
          ))}
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center justify-center rounded-lg bg-[#0c4a8a] px-5 py-3 text-sm font-medium tracking-wide text-white transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          ← Back to home
        </Link>
      </motion.div>
    </div>
  );
};
