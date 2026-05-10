import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar
from "./components/Navbar";

import ATSAnalyzer
from "./pages/ATSanalyzer";

import AnalysisDetails
from "./pages/AnalysisDetails";

import Dashboard
from "./pages/Dashboard";

function App() {

  return (

    <BrowserRouter>

      {/* GLOBAL NAVBAR */}

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<ATSAnalyzer />}
        />

        <Route
          path="/analysis/:id"
          element={<AnalysisDetails />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;