// Importa i metodi necessari da Firebase Firestore
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDoc, doc, updateDoc} from "firebase/firestore";
import { updateCV } from "@/auth/user-registration";

// Inizializza Firestore
const db = getFirestore();
const auth = getAuth();

//DAO per l'utente e le varie funzionalità



/**
 * Ottiene l'UID dell'utente attualmente autenticato.
 * @returns {Promise<string>} - Restituisce l'UID dell'utente.
 * @throws {Error} - Solleva un errore se l'utente non è autenticato.
 */
export async function getCurrentUserUID() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid); // Restituisce l'UID se l'utente è autenticato
      } else {
        reject(new Error("Nessun utente autenticato."));
      }
    });
  });
}

export async function updateUserProfile(uid, profileData) {
  try {
    const userDocRef = doc(db, 'utenti', uid); // La collezione è 'utenti'
    await updateDoc(userDocRef, profileData);
    console.log('Profilo aggiornato con successo!');
    return { success: true }; // Ritorna un oggetto di successo
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    return { success: false, error: error.message }; // Ritorna un oggetto di errore
  }
}


export async function updateUserProfileWithCV(userId, formData) {
  try {
    // Crea un oggetto per i dati da aggiornare
    const updatedData = {
      nome: formData.nome,
      cognome: formData.cognome,
      sesso: formData.genere,
      titoloDiStudio: formData.titoloDiStudio,
      competenze: formData.competenze,
      occupazione: formData.occupazione,
      field: formData.field || "",
      updatedAt: new Date().toISOString(), // Aggiungi la data dell'ultimo aggiornamento
    };

    // Se l'utente ha caricato un nuovo CV, gestiscilo
    let cvURL = formData.cv ? await updateCV(formData.cv, userId, formData.oldCvURL) : formData.oldCvURL;

    // Aggiungi l'URL del CV aggiornato
    if (cvURL) {
      updatedData.cv = cvURL;
    }

    // Aggiorna i dati utente in Firestore
    const updateResult = await updateUserProfile(userId, updatedData);

    if (updateResult.success) {
      console.log("Profilo e CV aggiornati con successo!");
      return { success: true };
    } else {
      return { success: false, error: updateResult.error };
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento del profilo completo:", error.message);
    return { success: false, error: error.message };
  }

}



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
      return { id: userId, ...utente.data() }; // Aggiunge l'ID all'oggetto dati
    } else {
      throw new Error("Utente non trovato!");
    }
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error);
    throw error; // Propaga l'errore al chiamante
  }
}
