// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error404 from "./components/pages/Error404";
import Error500 from "./components/pages/Error500";
import Error403 from "./components/pages/Error403";
import populateDatabase from "./populateFirebase"; // Importa la funzione di popolamento

const App = () => {
  useEffect(() => {
    // Popola il database all'avvio del progetto
    populateDatabase();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
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
