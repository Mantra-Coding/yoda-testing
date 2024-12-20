import { useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Custom hook per gestire la logica della ricerca di mentori
 * @returns {object} Funzioni e stati utili per il componente MentorSearchForm
 */
export function useMentorSearch() {
  const [mentors, setMentors] = useState([]); // Lista dei mentori trovati
  const [loading, setLoading] = useState(false); // Stato di caricamento
  const [error, setError] = useState(""); // Messaggi di errore

  const db = getFirestore();

  /**
   * Esegue una query su Firestore per trovare mentori in base ai criteri
   * @param {object} searchCriteria - Oggetto con i criteri di ricerca
   * @param {string} searchCriteria.field - Campo di interesse del mentore
   * @param {string} searchCriteria.occupation - Occupazione del mentore
   * @param {number} searchCriteria.availability - Ore settimanali di disponibilità
   * @param {string} searchCriteria.meetingMode - Modalità di incontro preferita (es. "online", "in-person")
   * @returns {Promise<void>}
   */
  const searchMentors = async ({ field, occupation, availability, meetingMode }) => {
    setLoading(true);
    setError("");

    try {
      const mentorsRef = collection(db, "utenti"); // Cambia "mentors" a "utenti"
      let q = query(mentorsRef);

      // Applica i filtri dinamicamente sulla base dei criteri di ricerca
      if (field) q = query(q, where("field", "==", field)); // Usa il campo "field" nel database
      if (occupation) q = query(q, where("occupazione", "==", occupation)); // Usa "occupazione" invece di "occupation"
      if (availability) q = query(q, where("availability", ">=", availability)); // Usa "availability"
      if (meetingMode) q = query(q, where("meetingMode", "==", meetingMode)); // Usa "meetingMode"

      // Esegui la query su Firestore
      const querySnapshot = await getDocs(q);
      const mentorList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (mentorList.length === 0) {
        setError("Nessun mentore trovato con i criteri specificati.");
      }
      
      // Aggiorna lo stato con i risultati
      setMentors(mentorList);
    } catch (err) {
      console.error("Errore durante la ricerca dei mentori:", err);
      setError("Si è verificato un errore durante la ricerca. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };
  return {
    mentors, // Lista dei mentori trovati
    loading, // Stato di caricamento
    error, // Messaggio di errore
    searchMentors, // Funzione per avviare la ricerca
  };
}
