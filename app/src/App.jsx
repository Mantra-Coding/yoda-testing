import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import Error404 from "./components/pages/Error404";
import Error500 from "./components/pages/Error500";
import Error403 from "./components/pages/Error403";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rotta Home */}
        <Route path="/" element={<h1>Home</h1>} />

        {/* Pagina di caricamento */}
        <Route path="/upload" element={<UploadPage />} />

        {/* Pagine di errore */}
        <Route path="/error/404" element={<Error404 />} />
        <Route path="/error/500" element={<Error500 />} />
        <Route path="/error/403" element={<Error403 />} />

        {/* Rotta di fallback */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
};

export default App;
