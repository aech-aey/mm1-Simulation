import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstPage from "./pages/FirstPage";

import Arrival from "./pages/Arrival";

import ArrivalService from "./pages/ArrivalService";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/service" element={<ArrivalService />} />
        <Route path="/arrival" element={<Arrival />}/>
      
      </Routes>
    </Router>
  );
};

export default App;
