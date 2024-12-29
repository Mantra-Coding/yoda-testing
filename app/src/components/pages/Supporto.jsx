"use client";

import { useEffect, useState } from "react"; // Usa React hooks
import Header from "../ui/Header"; // Importa il componente Header
import { getAllMentors } from "@/dao/supportoDAO"; // Importa la funzione dal DAO per ottenere tutti i mentori
import { Card, CardContent } from "@/components/ui/card"; // Importa i componenti per le cards
import { Button } from "@/components/ui/button"; // Importa il componente Button
import { Phone, Mail } from "lucide-react"; // Importa le icone

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
    <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-white">
      <Header /> {/* Aggiungi l'header */}
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">Richiedi Supporto</h1>
          <Select>
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Mentori Disponibili</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="bg-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold">{mentor.nome} {mentor.cognome}</h3>
                  <p className="text-sm text-gray-500">Occupazione: {mentor.occupazione}</p>
                  <p className="text-sm text-gray-500">Competenze:</p>
                  <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {/* Trasforma 'competenze' in un array se è una stringa */}
                    {Array.isArray(mentor.competenze) || typeof mentor.competenze === 'string' ? (
                      (mentor.competenze.split(",") || [mentor.competenze]).map((competenza, index) => (
                        <li key={index}>{competenza.trim()}</li>
                      ))
                    ) : (
                      <li>Nessuna competenza disponibile</li>
                    )}
                  </ul>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Contatta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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
