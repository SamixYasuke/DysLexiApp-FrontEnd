// module imports
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components import
import DyslexiBearLoader from "./components/DyslexiBearLoader.jsx";

// Use lazy loading for page components
const Home = lazy(() => import("./pages/Home"));
const Levels = lazy(() => import("./pages/Levels"));
const SoundSelector = lazy(() => import("./pages/SoundSelector"));
const SeeAndType = lazy(() => import("./pages/SeeAndType"));
const HearAndType = lazy(() => import("./pages/HearAndType"));
const SeeAndTalk = lazy(() => import("./pages/SeeAndTalk"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const HearAndPronounce = lazy(() => import("./pages/HearAndPronounce"));
const ReadAndPronounce = lazy(() => import("./pages/ReadAndPronounce"));
const NotFoundPage = lazy(() => import("./pages/404"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <section>
            <DyslexiBearLoader />
          </section>
        }
      >
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

// // module imports
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // pages imports
// import Home from "./pages/Home";
// import Levels from "./pages/Levels";
// import SoundSelector from "./pages/SoundSelector";
// import SeeAndType from "./pages/SeeAndType";
// import HearAndType from "./pages/HearAndType";
// import SeeAndTalk from "./pages/SeeAndTalk";
// import GetStarted from "./pages/GetStarted";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import HearAndPronounce from "./pages/HearAndPronounce";
// import ReadAndPronounce from "./pages/ReadAndPronounce";
// import NotFoundPage from "./pages/404";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/unit/:unitId" element={<Levels />} />
//         <Route
//           path="/sound-selector/:levelNumber"
//           element={<SoundSelector />}
//         />
//         <Route path="/see-and-type/:levelNumber" element={<SeeAndType />} />
//         <Route path="/hear-and-type/:levelNumber" element={<HearAndType />} />
//         <Route path="/see-and-talk/:levelNumber" element={<SeeAndTalk />} />
//         <Route
//           path="/hear-and-pronounce/:levelNumber"
//           element={<HearAndPronounce />}
//         />
//         <Route
//           path="/read-and-pronounce/:levelNumber"
//           element={<ReadAndPronounce />}
//         />
//         <Route path="/get-started" element={<GetStarted />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
