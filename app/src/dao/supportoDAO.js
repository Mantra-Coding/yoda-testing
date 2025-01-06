import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Assicurati che query sia importato

/**
 * Recupera tutti i mentori dal database.
 * @returns {Promise<Object>} - Un oggetto contenente il successo e i dati o l'errore.
 */
export async function getAllMentors() {
  const db = getFirestore(); // Definizione corretta della variabile db
  try {
    console.log("Inizio query per recuperare tutti i mentori...");

    // Crea una query per ottenere tutti gli utenti con userType 'mentor'
    const q = query(
      collection(db, "utenti"), // Usa db per riferirti a Firestore
      where("userType", "==", "mentor") // Filtra per 'mentor'
    );

    // Esegui la query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("Nessun mentore trovato.");
      return { success: true, data: [] }; // Nessun mentore trovato
    }

    const mentoriData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), // Aggiungi i dati del documento all'oggetto
    }));

    console.log("Mentori trovati:", mentoriData);

    return { success: true, data: mentoriData };
  } catch (error) {
    console.error("Errore durante il recupero dei mentori:", error);
    return { success: false, error: error.message }; // Ritorna un oggetto di errore
  }
}

/**
 * Recupera i mentori di sesso femminile dal database.
 * @returns {Promise<Object>} - Un oggetto contenente il successo e i dati o l'errore.
 */
export async function getMentoriFemmina() {
  const db = getFirestore(); // Definizione corretta della variabile db
  try {
    console.log("Inizio query per recuperare mentori femmina...");

    // Crea una query per ottenere solo gli utenti di sesso femminile e userType 'mentor'
    const q = query(
      collection(db, "utenti"), // Usa db per riferirti a Firestore
      where("sesso", "==", "femmina"), // Assicurati che i valori siano in minuscolo se così sono nel database
      where("userType", "==", "mentor")
    );

    // Esegui la query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("Nessun mentore trovato con i criteri specificati.");
      return { success: true, data: [] }; // Nessun mentore trovato
    }

    const mentoriData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), // Aggiungi i dati del documento all'oggetto
    }));

    console.log("Mentori trovati:", mentoriData);

    return { success: true, data: mentoriData };
  } catch (error) {
    console.error("Errore durante il recupero dei mentori:", error);
    return { success: false, error: error.message }; // Ritorna un oggetto di errore
  }
}
