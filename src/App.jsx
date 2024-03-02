// module imports
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages imports
import Home from "./pages/Home";
import Levels from "./pages/Levels";
import SoundSelector from "./pages/SoundSelector";
import SeeAndType from "./pages/SeeAndType";
import HearAndType from "./pages/HearAndType";
import SeeAndTalk from "./pages/SeeAndTalk";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HearAndPronounce from "./pages/HearAndPronounce";
import ReadAndPronounce from "./pages/ReadAndPronounce";
import NotFoundPage from "./pages/404";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unit/:unitId" element={<Levels />} />
        <Route
          path="/sound-selector/:levelNumber"
          element={<SoundSelector />}
        />
        <Route path="/see-and-type/:levelNumber" element={<SeeAndType />} />
        <Route path="/hear-and-type/:levelNumber" element={<HearAndType />} />
        <Route path="/see-and-talk/:levelNumber" element={<SeeAndTalk />} />
        <Route
          path="/hear-and-pronounce/:levelNumber"
          element={<HearAndPronounce />}
        />
        <Route
          path="/read-and-pronounce/:levelNumber"
          element={<ReadAndPronounce />}
        />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
