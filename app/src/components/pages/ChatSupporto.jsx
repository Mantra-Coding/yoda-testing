import React, { useState, useEffect } from "react";
import { getSupportMessages, sendSupportMessage,createChat } from "@/dao/chatSupportoDAO";
import app from "@/firebase/firebase";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { useAuth } from "@/auth/auth-context";
import { Card, CardHeader } from "@/components/ui/card";
import { useParams, useLocation } from "react-router-dom";




const db = getFirestore(app);

export default function ChatSupporto() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentor, setMentor] = useState(null);
  const { mentorId } = useParams(); // Recupera mentorId dall'URL
  const [mentorDetails, setMentorDetails] = useState(null);
  const location = useLocation();
  const { userId, userType, user } = useAuth(); // Aggiungi `user` per accedere al nome
  const [menteeDetails, setMenteeDetails] = useState(null);


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Estrai i parametri della query string
    const problemType = queryParams.get("problemType"); // Ottieni il parametro 'problemType'
    if (problemType) {
      setMessage(`Ciao, ti contatto per il mio problema relativo al: ${problemType}`); // Imposta il messaggio
    }
  }, [location.search]); // Effettua l'effetto quando cambia la query string
  
  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!mentorId) {
        console.error("Mentor ID non disponibile.");
        setError("Mentor ID non disponibile.");
        return;
      }
  
      try {
        const mentorDocRef = doc(db, "utenti", mentorId); // Usa il mentorId per ottenere i dettagli
        const mentorDoc = await getDoc(mentorDocRef);
  
        if (mentorDoc.exists()) {
          const mentorData = mentorDoc.data();
          setMentorDetails(mentorData); // Salva i dettagli nello stato
        } else {
          console.warn("Dettagli del mentore non trovati.");
        }
      } catch (err) {
        console.error("Errore durante il recupero dei dettagli del mentore:", err);
        setError("Errore durante il recupero dei dettagli del mentore.");
      }
    };
  
    fetchMentorDetails(); // Chiamata al caricamento dei dettagli
  }, [mentorId]); // Si attiva quando `mentorId` cambia
  
  
//Secondo useEffect serve per visualizzare i messaggi
useEffect(() => {
  const fetchMessages = async () => {
    if (!mentorId) {
      console.error("Mentor ID non disponibile per i messaggi.");
      setError("Mentor ID non disponibile per i messaggi.");
      return;
    }

    setLoading(true); // Mostra il caricamento
    try {
      const chatId = `${userId}_${mentorId}`; // Genera l'ID unico della chat
      const fetchedMessages = await getSupportMessages(chatId); // Usa il chatId univoco

      if (fetchedMessages && fetchedMessages.length > 0) {
        setMessages(fetchedMessages); // Salva i messaggi nello stato
      } else {
        console.warn("Nessun messaggio trovato.");
        setMessages([]); // Resetta i messaggi
      }
    } catch (err) {
      console.error("Errore durante il recupero dei messaggi:", err);
      setError("Errore durante il recupero dei messaggi.");
    } finally {
      setLoading(false); // Nascondi il caricamento
    }
  };

  fetchMessages(); // Chiamata al caricamento dei messaggi
}, [mentorId]); // Si attiva quando `mentorId` cambia

//Use effect per il controllo mentore/mentee
useEffect(() => {
  const fetchMenteeDetails = async () => {
    if (userType === "mentor" && messages.length > 0) {
      try {
        // Recupera l'ID del mentee dalla prima chat disponibile
        const menteeId = messages[0]?.senderId !== userId ? messages[0]?.senderId : messages[0]?.chatId;
        if (!menteeId) {
          console.error("Mentee ID non disponibile.");
          return;
        }

        const menteeDocRef = doc(db, "utenti", menteeId);
        const menteeDoc = await getDoc(menteeDocRef);

        if (menteeDoc.exists()) {
          setMenteeDetails(menteeDoc.data());
        } else {
          console.warn("Dettagli del mentee non trovati.");
        }
      } catch (err) {
        console.error("Errore durante il recupero dei dettagli del mentee:", err);
      }
    }
  };

  fetchMenteeDetails();
}, [userType, messages]);




const handleSendMessage = async () => {
  if (!message.trim()) {
    console.warn("Messaggio vuoto non inviato.");
    return;
  }

  const chatId = `${userId}_${mentorId}`; // Genera un ID unico basato su menteeId e mentorId
  const newMessage = {
    chatId, // Usa l'ID univoco della chat
    senderId: userId, // ID dell'utente che invia il messaggio
    text: message,
    timestamp: Date.now(),
  };

  try {
    // Determina il ruolo dell'utente corrente
    const menteeId = userType === "mentee" ? userId : mentorId; // Se è un mentee, il suo ID è il `userId`
    const mentorIdFinal = userType === "mentor" ? userId : mentorId; // Se è un mentore, il suo ID è il `userId`

    // Recupera i nomi corretti
    const menteeName =
      userType === "mentee"
        ? `${user?.nome || "Mentee"} ${user?.cognome || "Sconosciuto"}`
        : "";
    const mentorName =
      userType === "mentor"
        ? `${user?.nome || "Mentore"} ${user?.cognome || "Sconosciuto"}`
        : "";

    // Crea la chat solo se necessario
    await createChat(menteeId, mentorId, menteeName, mentorName);

    // Invia il messaggio
    await sendSupportMessage(newMessage);

    // Aggiorna i messaggi nella chat
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  } catch (err) {
    console.error("Errore durante l'invio del messaggio:", err);
    setError("Errore durante l'invio del messaggio.");
  }
};

  
  
  
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7]">
    <div className="container mx-auto py-6 space-y-6 text-white">  
        <Card className="w-full bg-[#f8f9fa] mb-4 rounded-lg p-4 shadow-sm">
          <CardHeader>
          <Card className="w-full bg-[#f8f9fa] mb-4 rounded-lg p-6 shadow-lg">
  <CardHeader>
    <div className="flex items-center space-x-6">
      {/* Foto del mentore */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center bg-cover bg-center text-white text-3xl font-bold shadow-md`}
        style={{
          backgroundImage: `url(${mentorDetails?.imageUrl || "/default-avatar.png"})`,
          backgroundColor: mentorDetails?.imageUrl ? "transparent" : "#178563",
        }}
      >
        {!mentorDetails?.imageUrl &&
          mentorDetails?.nome &&
          mentorDetails?.cognome &&
          `${mentorDetails.nome[0]}${mentorDetails.cognome[0]}`}
      </div>

      {/* Dettagli del mentore */}
      <div className="flex flex-col">
      <h2 className="text-3xl font-bold text-[#178563] mb-1">
  {userType === "mentor"
    ? `Stai supportando ${
        menteeDetails?.nome && menteeDetails?.cognome
          ? `${menteeDetails.nome} ${menteeDetails.cognome}`
          : "Mentee Sconosciuto"
      }`
    : `Hai Richiesto il supporto di ${
        mentorDetails?.nome && mentorDetails?.cognome
          ? `${mentorDetails.nome} ${mentorDetails.cognome}`
          : "Mentore Sconosciuto"
      }`}
</h2>

        <p className="text-lg text-gray-600">
          {mentorDetails?.occupazione || "Informazioni sul mentore"}
        </p>
      </div>
    </div>
  </CardHeader>
</Card> {/* Area messaggi */}
<div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 shadow-inner h-full">
  {loading ? (
    <p className="text-gray-500">Caricamento messaggi...</p>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : messages.length > 0 ? (
    messages.map((msg, index) => (
      <div
        key={index}
        className={`flex items-center mb-4 ${
          msg.senderId === userId ? "justify-end" : "justify-start"
        }`}
      >
        {/* Avatar del mittente */}
        {msg.senderId !== userId && (
          <div
            className="w-10 h-10 rounded-full bg-[#178563] flex items-center justify-center text-white text-sm font-bold mr-2"
            style={{
              backgroundImage: `url(${mentorDetails?.imageUrl || "/default-avatar.png"})`,
              backgroundColor: mentorDetails?.imageUrl ? "transparent" : "#178563",
            }}
          >
            {!mentorDetails?.imageUrl &&
              mentorDetails?.nome &&
              mentorDetails?.nome[0].toUpperCase()}
          </div>
        )}

        {/* Contenuto del messaggio */}
        <div
          className={`px-4 py-3 max-w-[70%] rounded-lg shadow-md ${
            msg.senderId === userId
              ? "bg-[#22A699] text-white"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          <p className="break-words">{msg.text}</p>
          <span className="block text-xs mt-2 text-right opacity-70">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Avatar dell'utente corrente */}
        {msg.senderId === userId && (
          <div
            className="w-10 h-10 rounded-full bg-[#178563] flex items-center justify-center text-white text-sm font-bold ml-2"
          >
            Tu
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-500 p-2">Nessun messaggio disponibile.</p>

  )}
</div>


          </CardHeader>
        </Card>

        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100v-100px)]">
          
  

     {/* Input per inviare messaggi */}
     <div className="p-4 bg-gray-100 border-t flex items-center">
     <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Scrivi un messaggio..."
  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22A699] outline-none text-gray-900"
/>

  <button
    onClick={handleSendMessage}
    className="ml-4 px-6 py-2 bg-[#22A699] text-white font-semibold rounded-lg shadow-md hover:bg-[#178563] transition"
  >
    Invia
  </button>
</div>



</div>
      </div>
    </div>
  );
}



