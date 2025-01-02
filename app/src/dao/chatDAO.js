import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import app from "@/firebase/firebase";

const db = getFirestore(app);

/**
 * Recupera la lista degli utenti dalla collezione `utenti`.
 * Esclude l'utente attualmente loggato.
 * @param {string} currentUserId - ID dell'utente attualmente loggato.
 * @returns {Promise<Array>} - Lista di utenti con nome, cognome, email e occupazione.
 */
export async function fetchUsers(currentUserId) {
  try {
    const usersSnapshot = await getDocs(collection(db, "utenti"));
    const users = [];
    usersSnapshot.forEach((docSnap) => {
      const userData = docSnap.data();
      if (docSnap.id !== currentUserId) {
        users.push({
          id: docSnap.id,
          nome: userData.nome || "Nome non disponibile",
          cognome: userData.cognome || "",
          email: userData.email || "Email non disponibile",
          occupazione: userData.occupazione || "Occupazione non specificata",
          imageUrl: "/default-avatar.png", // Immagine di default (modificabile se presente nel database)
        });
      }
    });
    return users;
  } catch (err) {
    console.error("Errore durante il recupero degli utenti:", err);
    throw new Error("Errore durante il recupero degli utenti.");
  }
}

/**
 * Recupera o crea una chat tra l'utente corrente e il partner selezionato.
 * @param {string} currentUserId - ID dell'utente attualmente loggato.
 * @param {string} partnerId - ID del partner con cui avviare la chat.
 * @param {string} partnerName - Nome del partner.
 * @returns {Promise<Object>} - Dettagli della chat (esistente o appena creata).
 */
export async function getOrCreateChat(currentUserId, partnerId, partnerName) {
  try {
    const chatRef = collection(db, "chats");
    const chatSnapshot = await getDocs(chatRef);
    let existingChat = null;

    // Controlla se esiste una chat tra gli utenti
    chatSnapshot.forEach((docSnap) => {
      const chatData = docSnap.data();
      if (
        (chatData.buyerId === currentUserId && chatData.sellerId === partnerId) ||
        (chatData.buyerId === partnerId && chatData.sellerId === currentUserId)
      ) {
        existingChat = { id: docSnap.id, ...chatData };
      }
    });

    if (existingChat) {
      return existingChat;
    } else {
      // Crea una nuova chat se non esiste
      const newChatRef = await addDoc(chatRef, {
        buyerId: currentUserId,
        sellerId: partnerId,
        messages: [],
        createdAt: Date.now(),
      });

      return {
        id: newChatRef.id,
        buyerId: currentUserId,
        sellerId: partnerId,
        messages: [],
        createdAt: Date.now(),
        partnerName,
      };
    }
  } catch (err) {
    console.error("Errore durante la creazione della chat:", err);
    throw new Error("Errore durante la creazione della chat.");
  }
}

/**
 * Invia un messaggio in una chat esistente.
 * @param {string} chatId - ID della chat.
 * @param {Object} message - Oggetto messaggio contenente testo, senderId e timestamp.
 * @returns {Promise<void>}
 */
export async function sendMessage(chatId, message) {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDocs(chatRef);

    if (chatSnap.exists()) {
      const chatData = chatSnap.data();
      const updatedMessages = [...chatData.messages, message];
      await updateDoc(chatRef, { messages: updatedMessages });
    }
  } catch (err) {
    console.error("Errore durante l'invio del messaggio:", err);
    throw new Error("Errore durante l'invio del messaggio.");
  }
}

/**
 * Ottieni tutti i messaggi in tempo reale per una chat.
 * @param {string} chatId - ID della chat.
 * @param {function} callback - Funzione callback per gestire i messaggi aggiornati.
 * @returns {function} - Funzione per annullare la sottoscrizione.
 */
export function subscribeToChat(chatId, callback) {
  return onSnapshot(doc(db, "chats", chatId), (docSnap) => {
    callback(docSnap.data());
  });
}
