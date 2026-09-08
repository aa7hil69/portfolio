import React from "react";
import { Navbar } from "../components/Navbar";
import { Description } from "../components/home/desc";
import { Companies } from "../components/home/companies";
import { Clients } from "../components/home/clients";
import { Contact } from "../components/home/contact";
import { Gallery } from "../components/home/gallery";
import { Events } from "../components/home/events";
import { ScrollToTopButton } from "../components/scrolltop";
export const Home = () => {
  return (
    <div className="bg-[#061d42] text-white">
      <style>{`html{scroll-behavior:smooth;}`}</style>

      <div className="overflow-x-hidden">
        <Navbar />
        <main>
          {/* Hero / Description */}
          {/* <section id="home" className="min-h-screen flex items-center">  */}
          <section id="home" className="flex items-center">
            <Description />
          </section>

          {/* <section id="companies" className="min-h-screen "> */}
          <section id="companies" className=" ">
            <Companies />
          </section>

          {/* <section id="clients" className="min-h-screen "> */}
          <section id="clients" className=" ">
            <Clients />
          </section>

          {/* <section id="contact" className="min-h-screen"> */}
          <section id="contact" className=" ">
            <Contact />
          </section>

          {/* <section id="gallery" className="min-h-screen "> */}
          <section id="gallery" className=" ">
            <Gallery />
          </section>
          {/* <section id="events" className="min-h-screen "> */}
          <section id="events" className=" ">
            <Events />
          </section>
          <ScrollToTopButton showAfter={200} />
        </main>
      </div>
    </div>
  );
};
