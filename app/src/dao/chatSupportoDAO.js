import { db } from "@/lib/firebase"; // Assicurati di avere l'istanza di Firebase configurata correttamente
import { collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";

// Funzione per inviare un messaggio
export const sendMessage = async (mentorId, userId, message) => {
  try {
    const messagesRef = collection(db, "chat", mentorId, "messages");
    await addDoc(messagesRef, {
      userId: userId,
      message: message,
      timestamp: new Date(),
    });
    console.log("Messaggio inviato con successo!");
  } catch (error) {
    console.error("Errore nell'invio del messaggio: ", error);
  }
};

// Funzione per ottenere i messaggi in tempo reale
export const getMessages = (mentorId, setMessages, setLoading) => {
  const messagesRef = collection(db, "chat", mentorId, "messages");
  const q = query(messagesRef, orderBy("timestamp"));

  // Ascolta i cambiamenti in tempo reale
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setLoading(false);
    const msgs = snapshot.docs.map((doc) => doc.data());
    setMessages(msgs);
  }, (error) => {
    console.error("Errore nel recupero dei messaggi: ", error);
    setLoading(false);
  });

  // Restituisce la funzione per annullare l'iscrizione
  return unsubscribe;
};
