// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import UserSkillInventory from "./pages/skillGapAnalysis/UserSkillInventory";

function App() {
  return (
    <Router>
      <header>
        <h1>SkillPath Pro</h1>
      </header>
      <main>
        <Routes>
          <Route path="/skill-gap-analysis" element={<UserSkillInventory />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
