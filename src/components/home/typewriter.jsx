// src/components/Typewriter.jsx
import React, { useEffect, useState } from "react";

export const Typewriter = ({ text, speed = 55, className = "", cursor = true })=> {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      setShown((prev) => prev + text[i]);
      i += 1;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {shown}
      {cursor && <span className="animate-pulse">|</span>}
    </span>
  );
}
