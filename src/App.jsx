import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Notfound } from "./pages/notfound";
import { UnderConstruction } from "./pages/underconstruction";

import "./index.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jj2" element={<UnderConstruction />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
};

export default App;
