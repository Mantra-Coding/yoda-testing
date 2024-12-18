import { useState } from "react";
import { loginUser } from "../../auth/user-login"; // Import delle funzioni di login e logout
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/ui/Header"; // Import del componente Header

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    setError(""); // Reset dell'errore
    setSuccessMessage(""); // Reset del messaggio di successo

    const result = await loginUser(email, password);
    if (result.success) {
      setSuccessMessage(`Login effettuato con successo! Benvenuto, ${result.email}`);
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Corpo della pagina */}
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Pannello sinistro */}
        <div className="flex items-center justify-center bg-[#0E8D6D] p-8">
          <div className="w-64">
            <div className="rounded-xl bg-white p-4 shadow-lg">
              <img
                src="/yoda-logo.png"
                alt="YODA Logo"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Pannello destro */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter a free software email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-600">{error}</p>}
              {successMessage && <p className="text-green-600">{successMessage}</p>}
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
    </div>
  );
}
