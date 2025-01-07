import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importa useLocation
import { loginUser } from "../../auth/user-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import Logo from "../assets/images/logo_easy.png";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Stato per il messaggio di successo
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Controlla se esiste un messaggio nello stato della navigazione
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Resetta lo stato per evitare di mostrare il messaggio su ricarica
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async () => {
      setError(""); // Reset dell'errore
      console.log("Avvio del processo di login");
  
      // Chiamata alla funzione di login
      const result = await loginUser(email, password);
      console.log("Risultato login:", result);
      
      
      if (result.success) {
            // Naviga in base al tipo di utente
            // Naviga verso HomePageUtente con i dati utente
            console.log("Login effettuato con successo, navigo a /HomePageUtente");
            window.location.href = "/HomePageUtente";
          } 
      else {
            setError(result.error);
            console.error(result.error);
          }
        };
  
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
    <div className="flex items-center justify-center bg-[#0E8D6D] p-8 relative">
    <div className="bg-white rounded-[2rem] shadow-md w-96 h-48 absolute"></div> {/* Aumentato la larghezza */}
    <div className="z-10 flex items-center justify-center w-96 h-48"> {/* Aumentato la larghezza */}
      <div className="w-48 h-48 bg-white flex items-center justify-center">
  <img
    src={Logo}
    alt="YODA Logo"
    className="object-contain max-w-full max-h-full"
  />
</div>
      </div>
    </div>

    <div className="flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#0E8D6D]">
          Benvenuto su Yoda
        </h2>
        <p className="text-center text-gray-600">Effettua il login per continuare</p>

        {successMessage && (
          <p className="text-green-600 text-sm text-center">
            {successMessage}
          </p>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                placeholder="Inserisci la tua email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Inserisci la tua password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            className="w-full bg-[#0E8D6D] hover:bg-[#0E8D6D]/90"
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
}
