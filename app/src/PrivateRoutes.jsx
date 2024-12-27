import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/auth-context";

function PrivateRoutes() {
  const { isLogged, nome, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    console.log("[PRIVATE ROUTES] Verifica in corso, caricamento...");
    return <div>Caricamento...</div>; // Indica che i dati di autenticazione sono in caricamento
  }

  if (!isLogged) {
    console.log("[PRIVATE ROUTES] Utente non loggato, reindirizzando a /login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("[PRIVATE ROUTES] Accesso consentito per l'utente: " + nome);
  return <Outlet />;
}

export default PrivateRoutes;

