import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "@/firebase/firebase";

// Funzione di registrazione
async function registerUser(formData, portfolioProjects) {
  try {
    // Ottieni l'istanza di Firebase Auth
    const auth = getAuth(app);

    // Registra l'utente con email e password
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

    // Ottieni l'UID dell'utente creato
    const userId = userCredential.user.uid;

    // Ottieni l'istanza di Firestore
    const db = getFirestore(app);

    // Crea un documento utente in Firestore
    const userData = {
      nome: formData.nome,
      cognome: formData.cognome,
      email: formData.email,
      sesso: formData.genere,
      dataNascita: formData.dataDiNascita,
      titoloDiStudio: formData.titoloDiStudio,
      competenze: formData.competenze,
      occupazione: formData.occupazione,
      userType: formData.userType,
      portfolioProjects: portfolioProjects || [],
      cv: formData.cv ? formData.cv.name : null, // Salva il nome del file CV
    };

    

    console.log("Utente registrato con successo!", userId);
    return { success: true, userId: userId };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.error("Errore: L'email è già registrata.");
      return { success: false, error: "L'email è già registrata." };
    } else {
      console.error("Errore durante la registrazione:", error.message);
      return { success: false, error: error.message };
    }
  }
}

export { registerUser };
