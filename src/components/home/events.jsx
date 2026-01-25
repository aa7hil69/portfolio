import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

/* ---------------- Animations ---------------- */

const slideInFromRight = {
  hidden: { opacity: 0, x: 40, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // smoother easeOutExpo-ish
    },
  },
};

const textStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardItem = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(3px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ---------------- Events ---------------- */

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Header animation */
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6 });
  const headerControls = useAnimation();

  useEffect(() => {
    headerControls.start(headerInView ? "show" : "hidden");
  }, [headerInView, headerControls]);

  /* Fetch events */
  useEffect(() => {
    let ignore = false;

    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();

        const mapped = Array.isArray(data.events)
          ? data.events.map((e) => ({
              id: e.id,
              title: e.event_name,
              description: e.event_details,
              image: e.photo1,
              date: e.posted_on,
              url: e.event_url,
            }))
          : [];

        if (!ignore) setEvents(mapped);
      } catch (err) {
        console.error("Events error:", err);
        if (!ignore) setError("Unable to load events");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchEvents();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="bg-[#061d42] min-h-screen overflow-x-hidden">
      <main className="mx-auto max-w-7xl px-4 py-12 text-white">
        {/* ---------- Header ---------- */}
        <motion.div
          ref={headerRef}
          variants={textStagger}
          initial="hidden"
          animate={headerControls}
          className="text-center mb-10"
        >
          <motion.h1
            variants={slideInFromRight}
            className="text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide"
          >
            Events
          </motion.h1>
        </motion.div>

        {/* ---------- States ---------- */}
        {loading && (
          <p className="text-center text-white/70">
            Loading events...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-center text-white/70">
            No events found.
          </p>
        )}

        {/* ---------- Events Grid ---------- */}
        {!loading && !error && events.length > 0 && (
          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: false,
              amount: 0.2,
              margin: "-120px 0px -120px 0px", // 👈 prevents early vanish
            }}
            className="
              grid gap-5
              sm:grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
            "
          >
            {events.map((event) => (
              <motion.article
                key={event.id}
                variants={cardItem}
                whileHover={{ y: -4, scale: 1.015 }}
                className="
                  bg-[#112a63]
                  rounded-lg overflow-hidden
                  ring-1 ring-white/10
                  hover:ring-white/20
                  transition
                "
              >
                {event.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="
                        h-full w-full object-cover
                        transition-transform duration-500
                        hover:scale-105
                      "
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-4">
                  <p className="text-xs text-white/60 mb-1">
                    {event.date}
                  </p>

                  <h2 className="text-sm font-semibold mb-1">
                    {event.title}
                  </h2>

                  <p className="text-xs text-white/80 line-clamp-4">
                    {event.description}
                  </p>

                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-3 text-blue-400 hover:underline text-xs"
                    >
                      View Event →
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </main>
    </section>
  );
};
