import {getFirestore,  collection,  where, query,  getDocs, addDoc,  orderBy, doc,  updateDoc,  setDoc,  getDoc, } from "firebase/firestore";
import app from "@/firebase/firebase";

const db = getFirestore(app);
const supportCollection = collection(db, "supportChat");
const supportMessagesCollection = collection(db, "supportChatMessages");

// Recupera le chat di un utente
export async function getChatsByUserId(userId) {
  try {
    console.log("Tentativo di recupero chat per l'utente:", userId);

    const chatsQuery = query(
      supportCollection,
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const chatsSnapshot = await getDocs(chatsQuery);

    if (chatsSnapshot.empty) {
      console.log("Nessuna chat trovata per l'utente:", userId);
      return { success: true, data: [] }; // Ritorna un array vuoto
    }

    const chats = [];
    for (const chatDoc of chatsSnapshot.docs) { // Modificato: chatDoc invece di doc
      const chatData = chatDoc.data();

      console.log("Chat trovata:", chatData);

      // Recupera i dettagli del mentee
      if (!chatData.menteeName || chatData.menteeName.includes("Sconosciuto")) {
        const menteeDocRef = doc(db, "utenti", chatData.menteeId);
        const menteeDoc = await getDoc(menteeDocRef);
        if (menteeDoc.exists()) {
          const menteeData = menteeDoc.data();
          chatData.menteeName = `${menteeData.nome || "Mentee"} ${menteeData.cognome || "Sconosciuto"}`;
        }
      }

      // Recupera i dettagli del mentore
      if (!chatData.mentorName || chatData.mentorName.includes("Sconosciuto")) {
        const mentorDocRef = doc(db, "utenti", chatData.mentorId);
        const mentorDoc = await getDoc(mentorDocRef);
        if (mentorDoc.exists()) {
          const mentorData = mentorDoc.data();
          chatData.mentorName = `${mentorData.nome || "Mentore"} ${mentorData.cognome || "Sconosciuto"}`;
        }
      }

      chats.push({ id: chatDoc.id, ...chatData }); // Modificato: chatDoc.id invece di doc.id
    }

    console.log("Chat elaborate:", chats);

    return { success: true, data: chats };
  } catch (err) {
    console.error("Errore durante il recupero delle chat:", err);
    return { success: false, error: "Errore durante il recupero delle chat." };
  }
}







// Recupera i messaggi di una chat
export async function getSupportMessages(chatId) {
  try {
    const messagesQuery = query(
      supportMessagesCollection,
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const messagesSnapshot = await getDocs(messagesQuery);
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
  } catch (err) {
    console.error("Errore durante il recupero dei messaggi:", err);
    throw new Error("Impossibile recuperare i messaggi.");
  }
}


// Invia un messaggio alla chat
export async function sendSupportMessage(message) {
  try {
    // Aggiungi il messaggio alla raccolta dei messaggi
    await addDoc(supportMessagesCollection, message);
    console.log("Messaggio inviato:", message);

    // Recupera il riferimento alla chat
    const chatDocRef = doc(db, "supportChat", message.chatId);
    const chatDoc = await getDoc(chatDocRef);

    // Verifica che la chat esista
    if (!chatDoc.exists()) {
      console.error("La chat non esiste. Creazione non riuscita.");
      return;
    }

    // Aggiorna la chat con le informazioni dell'ultimo messaggio
    await updateDoc(chatDocRef, {
      lastMessage: message.text,
      updatedAt: message.timestamp,
    });

    console.log("Chat aggiornata con l'ultimo messaggio:", message.text);
  } catch (err) {
    console.error("Errore durante l'invio del messaggio di supporto:", err);
    throw new Error("Impossibile inviare il messaggio.");
  }
}





// Crea una nuova chat
function generateChatId(menteeId, mentorId) {
  return `${menteeId}_${mentorId}`; // Genera ID univoco per la chat
}

export async function createChat(menteeId, mentorId, menteeName, mentorName) {
  try {
    const chatId = generateChatId(menteeId, mentorId);
    console.log("Dati ricevuti da createChat:", { chatId, menteeId, menteeName, mentorId, mentorName });

    const chatDocRef = doc(db, "supportChat", chatId);
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      const newChat = {
        chatId,
        menteeId,
        menteeName,
        mentorId,
        mentorName,
        participants: [menteeId, mentorId],
        lastMessage: "",
        updatedAt: Date.now(),
      };

      await setDoc(chatDocRef, newChat);
      return { success: true, id: chatId };
    } else {
      return { success: true, id: chatId };
    }
  } catch (err) {
    console.error("Errore durante la creazione della chat:", err);
    return { success: false, error: "Impossibile creare la chat." };
  }
}








