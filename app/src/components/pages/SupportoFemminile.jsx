import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../ui/Header";
import { getMentoriFemmina } from "@/dao/supportoDAO"; // Assicurati che il percorso sia corretto

export default function SupportoFemminile() {
  const [mentori, setMentori] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica i mentori quando il componente è montato
  useEffect(() => {
    const fetchMentori = async () => {
      try {
        console.log("Caricamento mentori femmina in corso...");
        const response = await getMentoriFemmina();
        if (response.success) {
          setMentori(response.data);
          console.log("Mentori caricati:", response.data);
        } else {
          console.error("Errore durante il recupero dei mentori:", response.error);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei mentori:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentori();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-white p-6 rounded-t-3xl">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="container mx-auto max-w-6xl pt-16">
        <div className="mb-12 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Rete di Supporto Femminile</h1>
          <p className="mx-auto max-w-2xl">
            Offriamo un ambiente di supporto dedicato alle donne, fornendo mentorship, risorse e una
            comunità per crescere sia personalmente che professionalmente.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-white">I Nostri Mentori e Aree di Supporto</h2>
          <p className="text-white">
            Scopri i nostri esperti mentori e le aree di supporto disponibili per il tuo sviluppo personale e professionale.
          </p>
        </div>

        {loading ? (
          <p className="text-white">Caricamento in corso...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentori.length > 0 ? (
              mentori.map((mentore) => (
                <Card key={mentore.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-6 flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">
                          {mentore.nome} {mentore.cognome}
                        </h3>
                        <p className="text-sm text-gray-500">{mentore.occupazione}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-emerald-700">Competenze:</h4>
                      <p className="text-sm text-gray-600">{mentore.competenze || "Non specificato"}</p>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          window.location.href = `/dettagli/${mentore.id}`;
                        }}
                      >
                        Visualizza Mentore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-white">Nessun mentore trovato.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
