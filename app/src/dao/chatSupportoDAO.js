import { getFirestore, collection, where, query, getDocs, addDoc, orderBy } from "firebase/firestore";
import app from "@/firebase/firebase";

const db = getFirestore(app);
const supportCollection = collection(db, "supportChat");

// Recupera i messaggi dalla chat di supporto
export async function getSupportMessages(mentorId) {
  try {
    const messagesQuery = query(
      collection(db, "supportChat"),
      where("chatId", "==", mentorId), // Filtra per chatId uguale a mentorId
      orderBy("timestamp", "asc")     // Ordina per timestamp
    );

    const messagesSnapshot = await getDocs(messagesQuery);
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages; // Ritorna i messaggi recuperati
  } catch (err) {
    console.error("Errore durante il recupero dei messaggi:", err);
    throw new Error("Impossibile recuperare i messaggi.");
  }
}
// Invia un messaggio alla chat di supporto
export async function sendSupportMessage(message) {
  try {
    await addDoc(supportCollection, message); // Aggiungi il messaggio alla raccolta
    console.log("Messaggio inviato:", message); // Debug
  } catch (err) {
    console.error("Errore durante l'invio del messaggio di supporto:", err);
    throw new Error("Impossibile inviare il messaggio.");
  }
}
