// src/components/shared/PhotoGrid5x5.jsx
import React from "react";

export const PhotoGrid5x5 = ({ images = [] }) => {
  const items = images.slice(0, 25);
  return (
    <section className="bg-[#061d42] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {items.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-md">
              <img
                src={src}
                alt={`Photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
