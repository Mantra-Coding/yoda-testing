//notifica dao

import {collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where } from 'firebase/firestore';

import { db } from '@/firebase/firebase';



// Riferimento alla collection notifiche
const notificationsCollectionRef = collection(db, 'notifiche');

/* // Ottiene l'ID dell'utente attualmente loggato
const getCurrentUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.uid : null;
}; */

// Funzione per creare una notifica
/**
 * Crea una notifica per l'assegnazione di una mentorship.
 * 
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 * @throws {Error} In caso di errore durante la creazione della notifica.
 */
export async function createNotificationMentorship(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Mentorship",
      corpo: `Hai ricevuto Mentorship da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(), // Timestamp corrente
    };

    await addDoc(notificationRef, newNotification); // Salva la notifica su Firestore
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
    throw error; // Propaga l'errore per la gestione a monte
  }
}

/**
 * Crea una notifica per un nuovo meeting schedulato.
 * 
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 * @throws {Error} In caso di errore durante la creazione della notifica.
 */
export async function createNotificationMeeting(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Nuovo meeting schedulato",
      corpo: `E' stato schedulato un nuovo meeting da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(), // Timestamp corrente
    };

    await addDoc(notificationRef, newNotification); // Salva la notifica su Firestore
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
    throw error; // Propaga l'errore per la gestione a monte
  }
}

/**
 * Crea una notifica per l'aggiornamento della data di un meeting.
 * 
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 * @throws {Error} In caso di errore durante la creazione della notifica.
 */
export async function updateNotificationMeeting(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Data del meeting modificata",
      corpo: `E' stata modificata la data del meeting da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(), // Timestamp corrente
    };

    await addDoc(notificationRef, newNotification); // Salva la notifica su Firestore
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
    throw error; // Propaga l'errore per la gestione a monte
  }
}

/**
 * Crea una notifica per l'eliminazione di un meeting.
 * 
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 * @throws {Error} In caso di errore durante la creazione della notifica.
 */
export async function removeNotificationMeeting(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Meeting eliminato",
      corpo: `E' stato eliminato un meeting da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(), // Timestamp corrente
    };

    await addDoc(notificationRef, newNotification); // Salva la notifica su Firestore
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
    throw error; // Propaga l'errore per la gestione a monte
  }
}

/**
 * Recupera tutte le notifiche di un utente.
 * 
 * @param {string} userId - ID dell'utente loggato.
 * @returns {Promise<Array<Object>>} Un array di notifiche.
 * @throws {Error} Se l'utente non è autenticato o si verifica un errore durante la query.
 */
export const getByDest = async (userId) => {
  if (!userId) throw new Error('Utente non autenticato');

  try {
    const q = query(notificationsCollectionRef, where('destinatario', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Errore durante il recupero delle notifiche:", error);
    throw error;
  }
};

/**
 * Recupera una notifica specifica tramite ID.
 * 
 * @param {string} id - ID della notifica.
 * @returns {Promise<Object>} La notifica corrispondente.
 * @throws {Error} Se la notifica non esiste o si verifica un errore durante il recupero.
 */
export const getById = async (id) => {
  try {
    const docRef = doc(db, 'notifiche', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Nessuna notifica trovata con questo ID');
    }
  } catch (error) {
    console.error("Errore durante il recupero della notifica:", error);
    throw error;
  }
};

/**
 * Elimina una notifica tramite ID.
 * 
 * @param {string} id - ID della notifica da eliminare.
 * @throws {Error} Se si verifica un errore durante l'eliminazione.
 */
export const deleteNotifica = async (id) => {
  try {
    const docRef = doc(db, 'notifiche', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Errore durante l'eliminazione della notifica:", error);
    throw error;
  }
};

/**
 * Estrae l'ID di una notifica.
 * 
 * @param {Object} notification - Oggetto della notifica.
 * @returns {string|null} L'ID della notifica o null se non esiste.
 */
export const getCurrentNotificaId = (notification) => notification?.id || null;
