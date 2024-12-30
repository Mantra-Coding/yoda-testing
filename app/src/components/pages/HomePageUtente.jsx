import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { useAuth } from "@/auth/auth-context";

export default function HomePageUtente() {
  const {userType, nome} = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Valori iniziali:", { userType, nome });
    if (nome && userType) {
      setLoading(false);
    }
  }, [nome, userType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Benvenuto {nome}
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Connettiti con mentori senior del settore IT e accelera la tua carriera
        </p>

        {/* Contenuto specifico per Mentee */}
        {userType === "mentee" && (
          <>
            <Button className="bg-white text-emerald-600 hover:bg-white/90 mb-16">
              Trova un Mentore
            </Button>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="p-6 text-center bg-white/95 hover:bg-white transition-colors">
                <h3 className="font-semibold mb-3">Esperienza Personalizzata</h3>
                <p className="text-sm text-gray-600">
                  Ricevi consigli su misura da professionisti esperti nel tuo campo di interesse.
                </p>
              </Card>
              <Card className="p-6 text-center bg-white/95 hover:bg-white transition-colors">
                <h3 className="font-semibold mb-3">Crescita Professionale</h3>
                <p className="text-sm text-gray-600">
                  Sviluppa le tue competenze con il supporto di mentori.
                </p>
              </Card>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-4">
                Seleziona Accuratamente i tuoi Mentori.
              </h2>
              <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
                Cerca
              </Button>
            </div>
          </>
        )}

        {/* Contenuto specifico per Mentore */}
        {userType === "mentor" && (
          <>
            <Button className="bg-white text-emerald-600 hover:bg-white/90 mb-16">
              Le tue Mentorship
            </Button>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="p-6 text-center bg-white/95 hover:bg-white transition-colors">
                <h3 className="font-semibold mb-3">Guida i Mentee</h3>
                <p className="text-sm text-gray-600">
                  Aiuta i mentee a sviluppare competenze essenziali.
                </p>
              </Card>
              <Card className="p-6 text-center bg-white/95 hover:bg-white transition-colors">
                <h3 className="font-semibold mb-3">Costruisci Relazioni</h3>
                <p className="text-sm text-gray-600">
                  Espandi la tua rete professionale nel settore IT.
                </p>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
