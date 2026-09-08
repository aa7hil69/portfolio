// import React, { useEffect, useState } from "react";

// export const Events = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let ignore = false;

//     async function fetchEvents() {
//       try {
//         const res = await fetch("/api/events");
//         if (!res.ok) throw new Error("Failed to fetch events");

//         const data = await res.json();

//         const mapped = Array.isArray(data.events)
//           ? data.events.map((e) => ({
//               id: e.id,
//               title: e.event_name,
//               description: e.event_details,
//               image: e.photo1,
//               date: e.posted_on,
//               url: e.event_url,
//             }))
//           : [];

//         if (!ignore) setEvents(mapped);
//       } catch (err) {
//         console.error("Events error:", err);
//         if (!ignore) setError("Unable to load events");
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     }

//     fetchEvents();
//     return () => {
//       ignore = true;
//     };
//   }, []);

//   return (
//     <div className="bg-[#061d42] min-h-screen overflow-x-hidden">
//       <main className="mx-auto max-w-7xl px-4 py-12 text-white">
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide mb-8 text-center">
//           Events
//         </h1>

//         {loading && (
//           <p className="text-center text-white/70">
//             Loading events...
//           </p>
//         )}

//         {error && (
//           <p className="text-center text-red-400">
//             {error}
//           </p>
//         )}

//         {!loading && !error && events.length === 0 && (
//           <p className="text-center text-white/70">
//             No events found.
//           </p>
//         )}

//         {!loading && !error && events.length > 0 && (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {events.map((event) => (
//               <article
//                 key={event.id}
//                 className="bg-[#112a63] rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition"
//               >
//                 {event.image && (
//                   <img
//                     src={event.image}
//                     alt={event.title}
//                     className="h-48 w-full object-cover"
//                     loading="lazy"
//                   />
//                 )}

//                 <div className="p-5">
//                   <p className="text-xs text-white/60 mb-1">
//                     {event.date}
//                   </p>

//                   <h2 className="text-lg font-semibold mb-2">
//                     {event.title}
//                   </h2>

//                   <p className="text-sm text-white/80 line-clamp-4">
//                     {event.description}
//                   </p>

//                   {event.url && (
//                     <a
//                       href={event.url}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="inline-block mt-4 text-blue-400 hover:underline text-sm"
//                     >
//                       View Event →
//                     </a>
//                   )}
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };
 
import React, { useEffect, useState } from "react";

/* ===============================
   CONFIG
   =============================== */
const BASE_URL = "https://jminternationalspc.com";
const AUTO_INTERVAL = 3500; // ms
const FADE_DURATION = 700;  // ms

/* ===============================
   IMAGE CAROUSEL (AUTO + SMOOTH)
   =============================== */
const EventImageCarousel = ({ images, title }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const hasImages = Array.isArray(images) && images.length > 0;
  const hasMultiple = hasImages && images.length > 1;

  // Auto shuffle only if multiple images
  useEffect(() => {
    if (!hasMultiple) return;

    const interval = setInterval(() => {
      fadeTo((index + 1) % images.length);
    }, AUTO_INTERVAL);

    return () => clearInterval(interval);
  }, [index, images, hasMultiple]);

  const fadeTo = (nextIndex) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(nextIndex);
      setVisible(true);
    }, FADE_DURATION);
  };

  // 🔹 NO IMAGE CASE (DESIGNED PLACEHOLDER)
  if (!hasImages) {
    return (
      <div className="h-48 w-full bg-gradient-to-br from-blue-900 to-blue-700
                      flex items-center justify-center text-white/60
                      text-sm tracking-wide">
        Event Image Coming Soon
      </div>
    );
  }

  return (
    <div className="relative h-48 w-full overflow-hidden">
      <img
        src={images[index]}
        alt={title}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x300?text=No+Image";
        }}
        className={`h-full w-full object-cover
          transition-opacity duration-700 ease-in-out
          ${visible ? "opacity-100" : "opacity-0"}
          ${!hasMultiple ? "scale-105 animate-slowZoom" : ""}
        `}
      />
    </div>
  );
};

/* ===============================
   EVENTS PAGE
   =============================== */
export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();

        const mapped = Array.isArray(data.events)
          ? data.events.map((e) => {
              const rawImages =
                e.photos ||
                e.images ||
                [e.photo1, e.photo2, e.photo3];

              const images = Array.isArray(rawImages)
                ? rawImages.filter(Boolean)
                : [rawImages].filter(Boolean);

              return {
                id: e.id,
                title: e.event_name,
                description: e.event_details,
                images: images.map((img) =>
                  img.startsWith("http")
                    ? img
                    : `${BASE_URL}/${img}`
                ),
                date: e.posted_on,
                url: e.event_url,
              };
            })
          : [];

        setEvents(mapped);
      } catch (err) {
        console.error(err);
        setError("Unable to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="bg-[#061d42] min-h-screen overflow-x-hidden">
      <main className="mx-auto max-w-7xl px-4 py-12 text-white">
        <h1 className="text-4xl font-teko text-center mb-10">
          Events
        </h1>

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

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-[#112a63] rounded-lg overflow-hidden
                           ring-1 ring-white/10
                           hover:ring-white/20 transition"
              >
                <EventImageCarousel
                  images={event.images}
                  title={event.title}
                />

                <div className="p-5">
                  <p className="text-xs text-white/60 mb-1">
                    {event.date}
                  </p>

                  <h2 className="text-lg font-semibold mb-2">
                    {event.title}
                  </h2>

                  <p className="text-sm text-white/80 line-clamp-4">
                    {event.description}
                  </p>

                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 text-blue-400 hover:underline"
                    >
                      View Event →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* GLOBAL ANIMATION */}
      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .animate-slowZoom {
          animation: slowZoom 12s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};
