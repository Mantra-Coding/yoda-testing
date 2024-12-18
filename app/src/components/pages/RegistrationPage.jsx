import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { registerUser } from "../../auth/user-registration"; // Import della funzione di registrazione

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataNascita: "",
    genere: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setError("");
    setSuccessMessage("");

    // Costruisci i dati aggiuntivi
    const additionalData = {
      displayName: `${formData.nome} ${formData.cognome}`,
    };

    // Chiama la funzione di registrazione
    const result = await registerUser(formData.email, formData.password, additionalData);

    if (result.success) {
      setSuccessMessage("Registrazione effettuata con successo! Benvenuto!");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-100">
      {/* Header */}
      <Header />

      {/* Registration Form */}
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-emerald-600">
              Registrazione Mentore o Mentee
            </CardTitle>
            <p className="text-gray-500 text-sm">
              Compila il form per registrarti come Mentore o Mentee
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cognome">Cognome</Label>
                  <Input
                    id="cognome"
                    name="cognome"
                    value={formData.cognome}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleRegister}
              >
                Registrati
              </Button>
              {error && <p className="text-red-600">{error}</p>}
              {successMessage && <p className="text-green-600">{successMessage}</p>}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
