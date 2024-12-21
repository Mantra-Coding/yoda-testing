// Importa i metodi necessari da Firebase Firestore
import { getFirestore, getDoc, doc} from "firebase/firestore";

// Inizializza Firestore
const db = getFirestore();

//DAO per l'utente e le varie funzionalità

/**
 * Recupera i dati di un utente dato il suo ID.
 * @param {string} userId - L'ID dell'utente da cercare.
 * @returns {Promise<Object>} - Un oggetto con i dati dell'utente se trovato.
 * @throws {Error} - Solleva un errore se il documento non esiste.
 */
export async function getUserByID(userId) {
  try {
    // Riferimento al documento
    const docRef = doc(db, "utenti", userId);
    
    // Recupera i dati del documento
    const utente = await getDoc(docRef);

    // Controlla se il documento esiste
    if (utente.exists()) {
      return utente.data(); // Restituisce i dati come oggetto
    } else {
      throw new Error("Utente non trovato!");
    }
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error);
    throw error; // Propaga l'errore al chiamante
  }
}
