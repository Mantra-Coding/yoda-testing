import React from "react"; // Importa React esplicitamente, se necessario
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./components/pages/UploadPage";
import Error404 from "./components/pages/Error404";
import Error500 from "./components/pages/Error500";
import Error403 from "./components/pages/Error403";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pagina di caricamento */}
        <Route path="/upload" element={<UploadPage />} />

        {/* Pagine di errore */}
        <Route path="/error/404" element={<Error404 />} />
        <Route path="/error/500" element={<Error500 />} />
        <Route path="/error/403" element={<Error403 />} />

        {/* Rotta di fallback */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
