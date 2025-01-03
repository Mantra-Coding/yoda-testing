
import { db } from "@/firebase/firebase";
import { getDocs, getDoc, collection, doc, addDoc } from "firebase/firestore";

const mentorshipSessionCollectionRef = collection(db, 'mentorship_session');

/**
 * Recupera una sessione di mentorship per ID.
 *
 * @param {string} mentorshipId - L'ID della sessione di mentorship da recuperare.
 * @returns {Promise<object>} I dati della sessione di mentorship.
 * @throws {Error} Se la sessione di mentorship non esiste.
 */



export async function fetchMentorship(userId) {
    try {
        const mentorshipSnapshot = await getDocs(mentorshipSessionCollectionRef);
        const sessions = mentorshipSnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(session => session.mentore === userId || session.mentee === userId); // Filtra per ID utente
        
        console.log("Sessioni di mentorship trovate:", sessions);
        return sessions;
    } catch (error) {
        console.error("Errore nel recupero delle sessioni mentorship:", error);
        throw error;
    }
}



export async function getById(mentorshipId) {
    try {
        const docRef = doc(mentorshipSessionCollectionRef, mentorshipId);
        const sessionData = await getDoc(docRef);
        
        if (sessionData.exists()) {
            return {
                id: mentorshipId,
                ...sessionData.data() // Restituisce i dati del documento
            };
        } else {
            throw new Error("Mentorship non trovata!");
        }
    } catch (error) {
        console.error("Errore durante il recupero della sessione mentorship", error);
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Inizializza una nuova sessione di mentorship.
 *
 * @param {string} mentorId - L'ID del mentore.
 * @param {string} menteeId - L'ID del mentee.
 * @returns {Promise<string>} L'ID della nuova sessione mentorship.
 * @throws {Error} Se la creazione della sessione fallisce.
 */
export async function initializeMentorship(mentorId, menteeId) {
    try {
        const mentorship = {
            mentore: mentorId,
            stato: "Attiva",
            mentee: menteeId,
            createdAt: new Date() // Aggiungi una data di creazione
        };

        const docRef = await addDoc(mentorshipSessionCollectionRef, mentorship);
        console.log("Mentorship creata con ID:", docRef.id); // Log dell'ID generato

        return docRef.id; // Restituisce l'ID del documento creato
    } catch (error) {
        console.error("Errore nella creazione della sessione mentorship", error);
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Recupera il mentore da una sessione di mentorship.
 *
 * @param {string} mentorshipId - L'ID della sessione di mentorship.
 * @returns {Promise<string>} L'ID del mentore.
 * @throws {Error} Se non è possibile recuperare il mentore.
 */
export async function getMentorById(mentorshipId) {
    try {
        const mentorshipData = await getById(mentorshipId);
        return mentorshipData.mentore;
    } catch (error) {
        console.error("Errore nel recupero del mentore:", error);
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Recupera il mentee da una sessione di mentorship.
 *
 * @param {string} mentorshipId - L'ID della sessione di mentorship.
 * @returns {Promise<string>} L'ID del mentee.
 * @throws {Error} Se non è possibile recuperare il mentee.
 */
export async function getMenteeById(mentorshipId) {
    try {
        const mentorshipData = await getById(mentorshipId);
        return mentorshipData.mentee;
    } catch (error) {
        console.error("Errore nel recupero del mentee:", error);
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Recupera tutte le sessioni di mentorship in cui un determinato utente è coinvolto come mentore o mentee.
 *
 * @param {string} userId - L'ID dell'utente da cercare.
 * @returns {Promise<object[]>} Una lista di sessioni di mentorship in cui l'utente è coinvolto.
 * @throws {Error} Se non è possibile recuperare le sessioni.
 */
export async function getByUser(userId) {
    try {
        const allSessions = await getAllMentorshipSessions(); // Recupera tutte le sessioni
        const userSessions = allSessions.filter(session =>
            session.mentore === userId || session.mentee === userId // Filtra per utente coinvolto
        );
        return userSessions;
    } catch (error) {
        console.error("Errore nel recupero delle sessioni per l'utente:", error);
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Recupera tutte le sessioni di mentorship dalla collezione.
 *
 * @returns {Promise<object[]>} Una lista di tutte le sessioni di mentorship.
 * @throws {Error} Se non è possibile recuperare tutte le sessioni.
 */
async function getAllMentorshipSessions() {
    try {
        const mentorshipSnapshot = await getDocs(mentorshipSessionCollectionRef);
        const sessions = mentorshipSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() // Restituisce i dati di ciascun documento
        }));
        return sessions;
    } catch (error) {
        console.error("Errore nel recupero di tutte le sessioni mentorship:", error);
        throw error; // Propaga l'errore al chiamante
    }
}
