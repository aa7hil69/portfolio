import React, { useState, useRef, useEffect } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faLinkedin, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion";

// --- Animations ---
const slideInFromLeft = {
  hidden: { opacity: 0, x: -50, filter: "blur(6px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 420, damping: 28 } },
};

const textStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const Contact = () => {
  // --- Form state ---
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const emailRe = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Name is required";
    if (!form.email.trim()) er.email = "Email is required";
    else if (!emailRe.test(form.email)) er.email = "Enter a valid email";
    if (!form.message.trim()) er.message = "Message is required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      showToast("success", "Message sent! We’ll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      showToast("error", `Send failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Contact buttons ---
  const contactButtons = [
    {
      icon: <FaMapMarkerAlt className="text-xl sm:text-2xl text-white" />,
      text: (
        <>
          Haffa House Hotel, Office no 303
          <br />
          Muscat, Sultanate of Oman
        </>
      ),
      onClick: () => {},
    },
    {
      icon: <FaEnvelope className="text-xl sm:text-2xl text-white" />,
      text: "info@jminternationalspc.com,\njessymathewhr@gmail.com",
      onClick: () => {},
    },
    {
      icon: <FaPhone className="text-xl sm:text-2xl text-white" />,
      text: "+968 9770 8198",
      onClick: () => {},
    },
  ];

  // --- Section scroll + glow ---
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const glowY = useTransform(scrollYProgress, [0, 1], [8, -6]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.4]);

  // --- Animation controls (play when in view, stay visible) ---
  const createAnimationController = (ref) => {
    const inView = useInView(ref, { amount: 0.2 });
    const controls = useAnimation();
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    useEffect(() => {
      if (inView) setHasBeenVisible(true);
    }, [inView]);

    useEffect(() => {
      if (hasBeenVisible) controls.start("show");
    }, [hasBeenVisible, controls]);

    return controls;
  };

  const textGroupRef = useRef(null);
  const textControls = createAnimationController(textGroupRef);

  const paraRef = useRef(null);
  const paraControls = createAnimationController(paraRef);

  const contentRef = useRef(null);
  const contentControls = createAnimationController(contentRef);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full min-h-screen bg-[#061d42] px-5 sm:px-6 md:px-8 lg:px-10 flex items-start justify-center pt-16 sm:pt-14 md:pt-16"
    >
      <motion.div style={{ width: "100%" }}>
        {toast && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[13]"
          >
            <div
              className={`rounded-lg px-4 py-3 text-sm shadow-xl ${
                toast.type === "success" ? "bg-emerald-500/90 text-white" : "bg-rose-500/90 text-white"
              }`}
            >
              {toast.text}
            </div>
          </motion.div>
        )}

        <div className="w-full max-w-6xl mx-auto py-10 sm:py-12 relative">
          {/* Glow */}
          <motion.div
            aria-hidden
            className="absolute -inset-1 pointer-events-none rounded-[28px] bg-gradient-to-br from-cyan-400/10 via-fuchsia-400/10 to-sky-400/10 blur-3xl"
            style={{ translateY: glowY, opacity: glowOpacity }}
          />

          {/* Heading */}
          <motion.div ref={textGroupRef} variants={slideInFromLeft} initial="hidden" animate={textControls} className="text-center mb-8 sm:mb-10">
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide">Get In Touch</h2>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500" />
            </div>
          </motion.div>

          {/* Paragraph */}
          <motion.p ref={paraRef} variants={fadeUp} initial="hidden" animate={paraControls} className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mt-4">
            For any queries, fill out the form. Prefer direct contact? Use the details from the tiles below.
          </motion.p>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center mt-8" ref={contentRef}>
            {/* Left Column */}
            <motion.div variants={textStagger} initial="hidden" animate={contentControls} className="w-full max-w-xl text-center md:text-left">
              <motion.h3 variants={slideUp} className="text-white text-[42px] sm:text-[56px] md:text-[72px] font-teko leading-[1.05] overflow-hidden">
                <motion.span initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.6 }}>
                  WRITE ME A MESSAGE
                </motion.span>
              </motion.h3>
              <motion.p variants={fadeUp} className="mt-3 text-white/75 text-sm sm:text-base font-light">
                If you have any questions, kindly take a moment to fill up this form. A representative will contact you shortly.
              </motion.p>

              {/* Social icons */}
              <motion.div variants={slideUp} className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-5">
                {[
                  { icon: faInstagram, href: "https://www.instagram.com/jm_international_spc/", color: "#E4405F" },
                  { icon: faYoutube, href: "#", color: "#FF0000" },
                  { icon: faLinkedin, href: "https://www.linkedin.com/in/jessy-mathew-55318b99/", color: "#0A66C2" },
                  { icon: faFacebook, href: "#", color: "#1877F2" },
                ].map((s, idx) => (
                  <a key={idx} href={s.href} aria-label={s.icon.iconName} className="p-1 -m-1 group">
                    <FontAwesomeIcon
                      icon={s.icon}
                      className="text-white/80 text-2xl transition-transform duration-200 group-hover:scale-110"
                      style={{ color: "currentColor" }}
                    />
                    <style>{`.group:hover svg { color: ${s.color} !important; }`}</style>
                  </a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column (Form) */}
            <motion.div variants={fadeUp} initial="hidden" animate={contentControls} className="relative w-full max-w-xl">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#22D3EE]/10 blur-xl pointer-events-none" />
              <motion.form
                onSubmit={onSubmit}
                variants={textStagger}
                initial="hidden"
                animate={contentControls}
                className="relative space-y-4 rounded-2xl bg-[#0a1a33]/90 p-5 sm:p-6 backdrop-blur border border-[#1b2c55]/40 shadow-[0_10px_30px_rgba(0,0,0,.45)]"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <motion.div variants={fadeUp}>
                    <label htmlFor="name" className="block text-white/70 text-xs mb-1">Name</label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Your name"
                      className={`w-full rounded-lg bg-[#0c1830] text-white placeholder-white/40 px-3 py-3 text-sm outline-none transition ${errors.name ? "ring-2 ring-rose-400/60" : ""}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name}</p>}
                  </motion.div>
                  {/* Email */}
                  <motion.div variants={fadeUp}>
                    <label htmlFor="email" className="block text-white/70 text-xs mb-1">Email</label>
                    <input
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@example.com"
                      className={`w-full rounded-lg bg-[#0c1830] text-white placeholder-white/40 px-3 py-3 text-sm outline-none transition ${errors.email ? "ring-2 ring-rose-400/60" : ""}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-300">{errors.email}</p>}
                  </motion.div>
                </div>
                {/* Message */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="message" className="block text-white/70 text-xs mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={6}
                    placeholder="Type your message here..."
                    className={`w-full rounded-lg bg-[#0c1830] text-white placeholder-white/40 px-3 py-3 text-sm outline-none transition resize-y ${errors.message ? "ring-2 ring-rose-400/60" : ""}`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-rose-300">{errors.message}</p>}
                </motion.div>

                <input type="text" name="website" defaultValue="" readOnly tabIndex={-1} style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" />

                <motion.div variants={fadeUp}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-56 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#0c1830] to-[#112244] text-white px-4 py-3 text-sm font-medium tracking-wide transition-all hover:scale-[1.02] shadow-[0_6px_20px_rgba(0,0,0,.35)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>

          {/* Contact Tiles */}
          <motion.div variants={textStagger} initial="hidden" animate={contentControls} className="w-full flex flex-wrap justify-center gap-4 sm:gap-6 mt-10">
            {contactButtons.map((btn, idx) => (
              <motion.div key={idx} variants={fadeUp} className="group relative rounded-xl overflow-hidden w-full sm:w-auto sm:min-w-[240px] max-w-[340px] transition hover:scale-[1.02]">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#22D3EE]/10 blur-lg pointer-events-none" />
                <button type="button" onClick={btn.onClick} className="relative bg-[#0b1d3a]/90 rounded-xl flex flex-col items-center gap-3 px-5 py-6 w-full text-white text-sm font-light text-center border border-white/5 shadow-[0_10px_24px_rgba(0,0,0,.35)]">
                  <span className="text-[#22D3EE]">{btn.icon}</span>
                  <span className="px-1 text-white/90">{btn.text}</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
