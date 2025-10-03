import React, { useRef } from "react";
import { useAnimateOnView } from "../../hooks/useAnimateOnView";

export const Services = () => {
  // Create refs for cards
  const cardTop = useRef(null);
  const card1 = useRef(null);
  const card2 = useRef(null);
  const card3 = useRef(null);
  const card4 = useRef(null);
  // Text refs
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  // Use the custom hook to add animation class on scroll
  useAnimateOnView([cardTop, card1, card2, card3, card4], "card-wipe-play-ltr");
  useAnimateOnView([headingRef, paragraphRef], "text-wipe-play");

  const bottomCardLabels = [
    "HR Consultancy",
    "Training & Development",
    "Outsourced Human Resources",
    "Metals & Minerals Trading",
  ];

  return (
    <div className="w-full min-h-[90vh] bg-[#040608] text-white font-teko">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* Top row */}
          <div className="col-span-12 grid grid-cols-12 gap-4 sm:gap-6 items-stretch">
            {/* Left text card */}
            <div className="col-span-12 lg:col-span-9">
              <div
                ref={headingRef}
                className="h-full rounded-lg pt-6 sm:pt-8 md:pt-10 pl-1 overflow-hidden flex flex-col items-start justify-start text-left text-wipe"
              >
                <div className="h-1 w-[140px] sm:w-[180px] md:w-[200px] bg-[#D4AF37]" />

                <h2 className="text-white text-xl sm:text-xl md:text-[80px] font-normal font-teko mt-2">
                  OUR SERVICES
                </h2>

                <p
                  ref={paragraphRef}
                  className="text-wipe mt-3 sm:mt-4 text-white text-sm sm:text-sm md:text-sm font-light font-teko leading-6"
                >
                  JM International SPC is a diversified and forward-thinking organization committed to delivering integrated solutions across human capital and global trade sectors. Our comprehensive suite of services includes Recruitment, HR Consultancy, Training & Development, Outsourced Human Resources, and Metals & Minerals Trading.
                </p>
              </div>
            </div>

            {/* Top-right card: compact on small/medium, full on lg */}
            {[{
              ref: cardTop,
              number: "01",
              label: "Recruitment Services",
              stagger: 1,
            }].map(({ ref, number, label, stagger }) => (
              <div
                key={number}
                ref={ref}
                className={`card-wipe card-stagger-${stagger} group relative
                            col-span-12 lg:col-span-3
                            w-full max-w-[380px] sm:max-w-[420px] lg:max-w-none
                            rounded-lg p-3 sm:p-4 lg:p-4
                            flex flex-col items-start justify-start gap-y-1.5 sm:gap-y-2 text-left
                            bg-[#181c24] overflow-hidden transition-colors duration-500 hover:bg-[#746328] hover:text-black
                            mt-2 sm:mt-4 lg:mt-40
                            min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:aspect-square`}
              >
                <div
                  className="pointer-events-none absolute inset-0
                             [clip-path:polygon(60%_100%,100%_30%,100%_100%)]
                             bg-black/15 translate-x-full translate-y-full
                             group-hover:translate-x-0 group-hover:translate-y-0
                             transition-transform duration-600 ease-out"
                />
                <span className="text-[#2a2a30] text-xl sm:text-xl md:text-xl font-teko">{number}</span>
                <span className="text-lg sm:text-lg md:text-lg font-light leading-5 sm:leading-6 block font-teko mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom row cards: smaller on sm/md; square only on lg+ */}
          <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {[card1, card2, card3, card4].map((ref, index) => (
              <div
                key={index}
                ref={ref}
                className={`card-wipe card-stagger-${index + 2} group relative
                            w-full rounded-lg p-3 sm:p-4
                            flex flex-col items-start justify-start gap-y-1.5 sm:gap-y-2 text-left
                            bg-[#181c24] overflow-hidden transition-colors duration-500 hover:bg-[#746328] hover:text-black
                            min-h-[110px] sm:min-h-[130px] md:min-h-[150px] lg:aspect-square`}
              >
                <div
                  className="pointer-events-none absolute inset-0
                             [clip-path:polygon(60%_100%,100%_30%,100%_100%)]
                             bg-black/15 translate-x-full translate-y-full
                             group-hover:translate-x-0 group-hover:translate-y-0
                             transition-transform duration-600 ease-out"
                />
                <span className="text-[#2a2a30] text-xl xl:text-xl md:text-xl font-teko">{`0${index + 2}`}</span>
                <span className="text-lg sm:text-lg md:text-lg leading-5 sm:leading-6 mt-1 font-light block font-teko">
                  {bottomCardLabels[index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
