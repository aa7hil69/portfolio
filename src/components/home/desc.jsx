import React, { useRef, useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { usePlayOnView } from "../../hooks/usePlayOnView";

export const Description = () => {
  const { ref: leftPlayRef } = usePlayOnView();
  const { ref: rightPlayRef } = usePlayOnView();

  // Observe this section for scroll-linked motion
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // 0 at enter, 1 at exit
  });

  // Left column: slide left on exit
  const xLeft = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -140]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.05]);

  // Right column: counter motion to the right
  const xRight = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 120]);

  // Portrait pointer tilt
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - py) * 10;
    const rotateY = (px - 0.5) * 12;
    setTilt({ rx: rotateX, ry: rotateY, s: 1.02 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, s: 1 });

  // Delayed intro controls (1s after load)
  const leftIntro = useAnimation();
  const rightIntro = useAnimation();
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(async () => {
      if (!mounted) return;
      // Kick off both left and right wrappers
      await Promise.all([
        leftIntro.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
        rightIntro.start({ x: 0, opacity: 1, transition: { type: "spring", duration: 0.8, bounce: 0.2 } }),
      ]);
      if (mounted) setStartTyping(true); // begin typewriter after the delay
    }, 1000); // 1 second delay

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [leftIntro, rightIntro]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#061d42] text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-12">
          {/* LEFT: Text (scroll-linked slide left on exit, returns on enter) */}
          <motion.div
            ref={(node) => {
              if (typeof leftPlayRef === "function") leftPlayRef(node);
              else if (leftPlayRef && "current" in leftPlayRef) leftPlayRef.current = node;
            }}
            className="order-1 md:order-1 flex flex-col items-start text-left px-4 md:px-0 hero-text-enter"
            style={{ x: xLeft, opacity: leftOpacity }}
            initial={{ opacity: 0, y: 24 }}
            animate={leftIntro}
          >
            <div className="w-full">
              {/* Masked headline reveal + delayed typewriter */}
              <motion.div
                className="overflow-hidden font-teko font-normal text-[44px] sm:text-[56px] md:text-[80px] leading-[1.05]"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.0 }} // ensure header mask reveal respects 1s delay
              >
                {startTyping ? (
                  <Typewriter words={["JESSY MATHEW"]} typeSpeed={50} cursor />
                ) : (
                  // Reserve space to avoid layout shift before typing starts
                  <span style={{ visibility: "hidden" }}>JESSY MATHEW</span>
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 420, damping: 28, delay: 1.0 }} // sync with 1s intro delay
                className="mt-4 text-white/95 font-teko font-light text-[15px] sm:text-[25px] leading-7"
              >
                At the heart of JM International SPC’s strategic growth is Jessy
                Mathew, a globally experienced HR leader, entrepreneur, and advisor
                with over 24 years of expertise spanning Oman, India, and the UK. 
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 420, damping: 28, delay: 1.05 }} // slight stagger
                className="mt-2 text-white/95 font-teko font-light text-[15px] sm:text-[25px] leading-7"
              >
                A respected figure in the Middle East’s HR and manpower ecosystem,
                Jessy brings visionary leadership to operations, strategy, and client
                engagements — known for cultural fluency, strategic foresight, and an
                unwavering commitment to ethical, impact‑driven business.
              </motion.p>

              <div className="mt-6 md:mt-8 flex items-center gap-5 md:gap-7">{/* CTA row */}</div>
            </div>
          </motion.div>

          {/* RIGHT: Portrait (slides right + 3D tilt) */}
          <motion.div
            ref={rightPlayRef}
            className="order-2 md:order-2 hero-img-enter flex justify-center md:justify-end"
            style={{ x: xRight }}
          >
            <motion.div
              className="perspective-1000"
              initial={{ x: 120, opacity: 0 }}
              animate={rightIntro}
            >
              <div
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="relative w-full max-w-[420px] h-[480px] sm:h-[540px] md:max-w-[460px] md:h-[620px]
                     rounded-lg transition-transform duration-300 will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`,
                }}
              >
                <div className="pointer-events-none absolute -inset-0.5 rounded-lg" />
                <img
                  src="/picsin/portrait.png"
                  alt="Portrait"
                  className="relative z-10 w-full h-full object-cover object-[35%_15%] select-none rounded-lg
                           transition-transform duration-300"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ WebkitUserDrag: "none", transform: "translateZ(24px)" }}
                />
                <div
                  className="absolute -bottom-3 left-6 right-6 h-6 rounded-full bg-black/60 blur-2xl opacity-60"
                  style={{ transform: "translateZ(0px)" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
