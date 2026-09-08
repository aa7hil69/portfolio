import React, { useState, useRef, useEffect } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faLinkedin, faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  motion,
  useScroll,
  useTransform,
  useAnimation,
  useInView,
} from "framer-motion";

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    x: 50,
    filter: "blur(6px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const textStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 420, damping: 28 } },
};

export const Contact = () => {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          website: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      showToast("success", "Message sent! We’ll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      showToast("error", "Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactButtons = [
    { icon: <FaMapMarkerAlt className="whitespace-pre-line text-white text-xl sm:text-2xl" />, text: (
      <>
        Haffa House Hotel, Office no 303
        <br />
        Muscat, Sultanate of Oman
      </>
    ), onClick: () => {} },
    { icon: <FaEnvelope className="text-white text-xl sm:text-2xl" />, text: "info@jminternationalspc.com,\njessymathewhr@gmail.com", onClick: () => {} },
    { icon: <FaPhone className="whitespace-pre-line text-white text-xl sm:text-2xl" />, text: "+968 9770 8198", onClick: () => {} },
  ];

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 15%"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [8, -6]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.4]);

  const textGroupRef = useRef(null);
  const textInView = useInView(textGroupRef, { amount: 0.35, once: true });
  const textControls = useAnimation();

  useEffect(() => {
    if (textInView) textControls.start("show");
  }, [textInView, textControls]);

  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, { amount: 0.25, once: true });
  const contentControls = useAnimation();

  useEffect(() => {
    if (contentInView) contentControls.start("show");
  }, [contentInView, contentControls]);

  const paraRef = useRef(null);
  const paraInView = useInView(paraRef, { amount: 0.35, once: true });
  const paraControls = useAnimation();

  useEffect(() => {
    if (paraInView) paraControls.start("show");
  }, [paraInView, paraControls]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full bg-[#061d42] px-4 sm:px-6 md:px-8"
    >
      <div className="w-full max-w-7xl mx-auto py-16 md:py-20 relative">
        {toast && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div
              className={[
                "rounded-lg px-4 py-3 text-sm shadow-xl",
                toast.type === "success" ? "bg-emerald-500/90 text-white" : "bg-rose-500/90 text-white",
              ].join(" ")}
            >
              {toast.text}
            </div>
          </motion.div>
        )}

          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-br from-cyan-400/10 via-fuchsia-400/10 to-sky-400/10 blur-3xl"
            style={{ translateY: glowY, opacity: glowOpacity }}
          />

          <motion.div
            ref={textGroupRef}
            variants={slideInFromLeft}
            initial="hidden"
            animate={textControls}
            className="relative text-center mb-6"
          >
            <motion.h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-teko tracking-wide">
              Get In Touch
            </motion.h2>
            <motion.div className="mt-3 flex justify-center">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400" />
            </motion.div>
          </motion.div>

          <motion.p
            ref={paraRef}
            variants={fadeUp}
            initial="hidden"
            animate={paraControls}
            className="relative text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-10 text-center"
          >
            For any queries, fill out the form and a representative will reach out soon. Prefer direct contact? Use the tiles below.
          </motion.p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start" ref={contentRef}>
            <motion.div
              variants={textStagger}
              initial="hidden"
              animate={contentControls}
              className="relative w-full text-center md:text-left"
            >
              <motion.div variants={slideUp} className="overflow-hidden">
                <motion.h3
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white text-[36px] sm:text-[48px] md:text-[56px] font-teko leading-[1.05]"
                >
                  WRITE ME ANY MESSAGE
                </motion.h3>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-3 text-white/75 text-sm sm:text-base font-light">
                If there are any queries, kindly take a moment to fill up this form. Our representatives will contact you shortly.
              </motion.p>

              <motion.div variants={slideUp} className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-5">
                <a href="https://www.instagram.com/jm_international_spc/" aria-label="Instagram" className="p-1 -m-1 group/ig" title="Instagram">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="text-white/80 transition-[transform,color] duration-200 text-2xl group-hover/ig:scale-110 group-hover/ig:text-[#E4405F]"
                  />
                </a>
                <a href="https://www.youtube.com/" aria-label="YouTube" className="p-1 -m-1 group/yt" title="YouTube">
                  <FontAwesomeIcon
                    icon={faYoutube}
                    className="text-white/80 transition-[transform,color] duration-200 text-2xl group-hover/yt:scale-110 group-hover/yt:text-[#FF0000]"
                  />
                </a>
                <a href="https://www.linkedin.com/in/jessy-mathew-55318b99/" aria-label="LinkedIn" className="p-1 -m-1 group/li" title="LinkedIn">
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    className="text-white/80 transition-[transform,color] duration-200 text-2xl group-hover/li:scale-110 group-hover/li:text-[#0A66C2]"
                  />
                </a>
                <a href="https://www.facebook.com/jessy.mathew" aria-label="Facebook" className="p-1 -m-1 group/fb" title="Facebook">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="text-white/80 transition-[transform,color] duration-200 text-2xl group-hover/fb:scale-110 group-hover/fb:text-[#1877F2]"
                  />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={contentControls}
              className="relative w-full"
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#22D3EE]/10 blur-xl pointer-events-none" />
              <motion.form
                onSubmit={onSubmit}
                variants={textStagger}
                initial="hidden"
                animate={contentControls}
                className="relative space-y-4 rounded-2xl bg-[#0a1a33]/90 p-5 sm:p-6 backdrop-blur supports-[backdrop-filter]:bg-[#0a1a33]/80 border border-[#1b2c55]/40 shadow-[0_10px_30px_rgba(0,0,0,.45)]"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={fadeUp}>
                    <label htmlFor="name" className="block text-white/70 text-xs mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      type="text"
                      placeholder="Your name"
                      required
                      className={`w-full rounded-lg bg-[#0c1830] text-white placeholder-white/40 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30 px-3 py-3 text-sm outline-none transition ${
                        errors.name ? "ring-2 ring-rose-400/60 border-rose-400/40" : ""
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name}</p>}
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <label htmlFor="email" className="block text-white/70 text-xs mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      type="email"
                      placeholder="you@example.com"
                      required
                      className={`w-full rounded-lg bg-[#0c1830] text-white placeholder-white/40 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30 px-3 py-3 text-sm outline-none transition ${
                        errors.email ? "ring-2 ring-rose-400/60 border-rose-400/40" : ""
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-300">{errors.email}</p>}
                  </motion.div>
                </div>

                <motion.div variants={fadeUp}>
                  <label htmlFor="message" className="block text-white/70 text-xs mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={6}
                    placeholder="Type your message here..."
                    required
                    className={`w-full rounded-lg bg-[#0c1830] text-white placeholder-white/40 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30 px-3 py-3 text-sm outline-none transition resize-y ${
                      errors.message ? "ring-2 ring-rose-400/60 border-rose-400/40" : ""
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-rose-300">{errors.message}</p>}
                </motion.div>

                <input
                  type="text"
                  name="website"
                  defaultValue=""
                  readOnly
                  tabIndex={-1}
                  style={{ position: "absolute", left: "-9999px" }}
                  aria-hidden="true"
                />

                <motion.div variants={fadeUp}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-56 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#0c1830] to-[#112244] text-white px-4 py-3 text-sm font-medium tracking-wide transition-all hover:scale-[1.02] hover:from-[#0a1a33] hover:to-[#0c1830] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_6px_20px_rgba(0,0,0,.35)]"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>

          <motion.div
            variants={textStagger}
            initial="hidden"
            animate={contentControls}
            className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12"
          >
            {contactButtons.map((btn, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="group relative rounded-xl overflow-hidden transition hover:scale-[1.02]"
              >
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#22D3EE]/10 blur-lg pointer-events-none" />
                <button
                  type="button"
                  onClick={btn.onClick}
                  className="relative bg-[#0b1d3a]/90 rounded-xl flex flex-col items-center gap-3 px-5 py-6 w-full h-full min-h-[140px] text-white text-sm font-light text-center border border-white/5 shadow-[0_10px_24px_rgba(0,0,0,.35)]"
                >
                  <span className="text-[#22D3EE]">{btn.icon}</span>
                  <span className="px-1 text-white/90 whitespace-pre-line">{btn.text}</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
      </div>
    </section>
  );
};
