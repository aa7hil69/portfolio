import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Notfound } from "./pages/notfound";

import "./index.css";

const App = () => {


return (
<>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<Notfound />} />
  </Routes>
</>
);
};

export default App;