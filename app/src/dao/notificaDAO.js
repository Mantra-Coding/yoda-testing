//notifica dao

import { getFirestore, collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where } from 'firebase/firestore';

import { app } from '@/firebase/firebase';


// Inizializzazione Firestore
const db = getFirestore(app);

// Riferimento alla collection notifiche
const notificationsCollectionRef = collection(db, 'notifiche');

/* // Ottiene l'ID dell'utente attualmente loggato
const getCurrentUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.uid : null;
}; */

// Funzione per creare una notifica
export async function createNotificationMentorship(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Mentorship",
      corpo: `Hai ricevuto Mentorship da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(),
    };

    await addDoc(notificationRef, newNotification);
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
  }
}
export async function createNotificationMeeting(mittenteId,destinatarioId,nomeMittente, cognomeMittente){
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Nuovo meeting schedulato",
      corpo: `E' stato schedulato un nuovo meeting da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(),
    };
    await addDoc(notificationRef, newNotification);
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
  }
}
export async function updateNotificationMeeting(mittenteId,destinatarioId,nomeMittente, cognomeMittente){
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Data del meeting modificata",
      corpo: `E' stata modificata la data del meeting da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(),
    };
    await addDoc(notificationRef, newNotification);
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
  }
}
export async function removeNotificationMeeting(mittenteId,destinatarioId,nomeMittente, cognomeMittente){
  try {
    // Aggiunge una nuova notifica alla collection "notifiche"
    const notificationRef = collection(db, "notifiche");
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: "Meeting eliminato",
      corpo: `E' stato eliminato un meeting da ${nomeMittente} ${cognomeMittente}`,
      timeStamp: new Date(),
    };
    await addDoc(notificationRef, newNotification);
    console.log("Notifica creata con successo!");
  } catch (error) {
    console.error("Errore nella creazione della notifica:", error);
  }
}
// Ottieni tutte le notifiche per l'utente loggato
export const getByDest = async (userId) => {
  if (!userId) throw new Error('Utente non autenticato');

  const q = query(notificationsCollectionRef, where('destinatario', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Ottieni una notifica tramite ID
export const getById = async (id) => {
  const docRef = doc(db, 'notifiche', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Nessuna notifica trovata con questo ID');
  }
};

// Elimina una notifica tramite ID
export const deleteNotifica = async (id) => {
  const docRef = doc(db, 'notifiche', id);
  await deleteDoc(docRef);
};

// Ottieni ID di una notifica
export const getCurrentNotificaId = (notification) => notification?.id || null;
