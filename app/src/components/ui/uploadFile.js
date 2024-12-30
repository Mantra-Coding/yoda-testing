import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/Firebase/firebase";

export const uploadFile = async (file) => {
    try {
        // Crea un riferimento nel bucket dello storage
        const fileRef = ref(storage, `uploads/${file.name}`);
        
        // Carica il file
        const snapshot = await uploadBytes(fileRef, file);
        console.log("File caricato con successo:", snapshot);

        // Ottieni l'URL di download
        const url = await getDownloadURL(fileRef);
        console.log("URL del file caricato:", url);

        return url;
    } catch (error) {
        console.error("Errore durante il caricamento del file:", error);
    }
};
