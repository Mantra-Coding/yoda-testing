import { useEffect, useState } from "react"; // Usa React hooks
import Header from "../ui/Header"; // Importa il componente Header
import { getAllMentors } from "@/dao/supportoDAO"; // Importa la funzione dal DAO per ottenere tutti i mentori
import { Card, CardContent } from "@/components/ui/card"; // Importa i componenti per le cards
import { Button } from "@/components/ui/button"; // Importa il componente Button
import { Phone, Mail } from "lucide-react"; // Importa le icone
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/auth/auth-context";

// Importazione dei componenti Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SupportPage() {
  const [mentors, setMentors] = useState([]); // Stato per memorizzare i mentori
  const [loading, setLoading] = useState(true); // Stato per la gestione del caricamento
  const navigate = useNavigate(); // Inizializza useNavigate
  const [selectedProblem, setSelectedProblem] = useState(""); // Stato per il problema selezionato
  const { userType } = useAuth();
  
  useEffect(() => {
    const loadMentors = async () => {
      const result = await getAllMentors(); // Chiama il DAO per ottenere i mentori
      if (result.success) {
        setMentors(result.data); // Imposta i mentori ricevuti nel state
      } else {
        console.error("Errore nel recupero dei mentori:", result.error);
      }
      setLoading(false); // Termina il caricamento
    };
    loadMentors(); // Carica i mentori al montaggio del componente
  }, []);

  if (loading) {
    return <div>Caricamento mentori...</div>; // Mostra il caricamento se i mentori non sono ancora caricati
  }

  const associations = [
    {
      name: "Telefono Rosa",
      description: "Supporto per donne vittime di violenza",
      phone: "1522",
      email: "telefonorosa@mail.com",
    },
    {
      name: "D.i.Re - Donne in Rete contro la violenza",
      description: "Rete nazionale antiviolenza",
      phone: "+39 06 6780537",
      email: "segreteria@direcontrolaviolenza.it",
    },
    {
      name: "Casa delle Donne per non subire violenza",
      description: "Centro antiviolenza di Bologna",
      phone: "+39 051 333173",
      email: "casadonne@women.it",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
      <Header /> {/* Aggiungi l'header */}
      <div className="mx-auto max-w-6xl space-y-8 p-6">
      {userType === "mentee" && ( // Mostra solo se l'utente è un mentee
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-white">Richiedi Supporto</h1>
    <Select onValueChange={(value) => setSelectedProblem(value)}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Seleziona un tipo di problema" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bullying">Bullying</SelectItem>
        <SelectItem value="discrimination">Discrimination</SelectItem>
        <SelectItem value="harassment">Harassment</SelectItem>
        <SelectItem value="work-life">Work-Life Balance</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}

  
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Mentori Disponibili</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="bg-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold">
                    {mentor.nome} {mentor.cognome}
                  </h3>
                  <p className="text-sm text-gray-500">Occupazione: {mentor.occupazione}</p>
                  <p className="text-sm text-gray-500">Competenze:</p>
                  <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {(mentor.competenze.split(",") || [mentor.competenze]).map(
                      (competenza, index) => (
                        <li key={index}>{competenza.trim()}</li>
                      )
                    )}
                  </ul>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      window.location.href = `/dettagli/${mentor.id}`;
                    }}
                  >
                    Visualizza Mentore
                  </Button>
                  <Button
      className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
      onClick={() => {
        if (!selectedProblem) {
          console.warn("Devi selezionare un problema prima di contattare un mentore.");
          return;
        }
    
        if (!mentor.id) {
          console.error("Mentor ID non disponibile.");
          return;
        }
    
        navigate("/chat-support", {
          state: { mentorId: mentor.id, problemType: selectedProblem }, // Passa mentorId e problemType come stato
        });
      }}
      disabled={!selectedProblem} // Disabilita se nessun problema è selezionato
    >
                    Contatta Mentore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <button
  onClick={() => navigate("/chat-list")}
  className="fixed bottom-8 right-8 z-50 flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg transition duration-300"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 10h.01M16 10h.01M21 16.938c0 2.485-3.582 4.5-8 4.5s-8-2.015-8-4.5M21 12.938c0 2.485-3.582 4.5-8 4.5s-8-2.015-8-4.5m16 0c0 2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5m16 0c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5"
    />
  </svg>
  Chat Supporto
</button>



        {/* Sezione Associazioni di Supporto */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Associazioni di Supporto</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {associations.map((association) => (
              <Card key={association.name} className="bg-white">
                <CardContent className="space-y-4 p-4">
                  <div>
                    <h3 className="font-semibold">{association.name}</h3>
                    <p className="text-sm text-gray-600">{association.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{association.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>{association.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-emerald-600 hover:text-emerald-700"
                  >
                    Visita il sito web
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
